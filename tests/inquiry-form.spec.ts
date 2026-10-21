import { expect, test } from '@playwright/test';

test('contact shows the chosen equipment and request purpose before asking for contact details', async ({ page }) => {
  await page.goto('/contact/?product=ARC-C25&request=datasheet');

  const form = page.locator('#inquiry-form');
  await expect(form).toHaveAttribute('data-form-variant', 'contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('WhatsApp / Phone')).toBeVisible();
  await expect(page.getByLabel('Company')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
  await expect(page.getByLabel('Country / Region')).toHaveCount(0);
  await expect(page.getByLabel('Product / Model')).toHaveValue('ARC-C25');
  await expect(page.getByLabel('I need')).toHaveValue('datasheet');
  await expect(page.getByLabel('Application')).toHaveCount(0);
  await expect(page.getByLabel('Project Requirements')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /Send Request/ }),
  ).toBeVisible();

  const dimensions = await form.evaluate((node) => {
    const input = node.querySelector('input[name="name"]');
    const textarea = node.querySelector('textarea[name="message"]');
    const button = node.querySelector('button[type="submit"]');
    return {
      formWidth: node.getBoundingClientRect().width,
      inputHeight: input?.getBoundingClientRect().height,
      textareaHeight: textarea?.getBoundingClientRect().height,
      buttonHeight: button?.getBoundingClientRect().height,
    };
  });
  expect(dimensions.inputHeight).toBeGreaterThanOrEqual(44);
  expect(dimensions.textareaHeight).toBeGreaterThanOrEqual(100);
  expect(dimensions.buttonHeight).toBeGreaterThanOrEqual(44);

  await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Your full name');
  await expect(page.getByLabel('Email')).toHaveAttribute('placeholder', 'your@email.com');
  await expect(page.getByLabel('WhatsApp / Phone')).toHaveAttribute(
    'placeholder',
    'Include country code',
  );
  await expect(page.getByLabel('Company')).toHaveAttribute(
    'placeholder',
    'Your company name',
  );
  await expect(page.getByLabel('Message')).toHaveAttribute(
    'placeholder',
    'A few details are enough to start: your application, destination or a question.',
  );

  const emptyErrorMetrics = await form.locator('.field-error:empty').evaluateAll((nodes) =>
    nodes.map((node) => ({
      display: getComputedStyle(node).display,
      height: node.getBoundingClientRect().height,
    })),
  );
  expect(emptyErrorMetrics.length).toBeGreaterThan(0);
  expect(
    emptyErrorMetrics.every(metric => metric.display === 'none' && metric.height === 0),
  ).toBe(true);
});

test('contact accepts a name and email alone and forwards visible document intent', async ({
  page,
}) => {
  let submitted: Record<string, unknown> = {};
  await page.route('**/inquiry', async (route) => {
    submitted = JSON.parse(route.request().postData() || '{}') as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, requestId: 'browser-test-1' }),
    });
  });

  await page.goto('/contact/?product=ARC-C25&request=datasheet');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await expect(page.getByText('Enter an email address or WhatsApp/phone number.')).toBeVisible();

  await page.getByLabel('Name').fill('Jane Buyer');
  await page.getByLabel('Email').fill('not-an-email');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();

  await page.getByLabel('Email').fill('jane@roof.test');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  expect(submitted).toMatchObject({
    formVariant: 'contact',
    name: 'Jane Buyer',
    email: 'jane@roof.test',
    phone: '',
    company: '',
    message: '',
    product: 'ARC-C25',
    model: 'ARC-C25',
    requestType: 'datasheet',
    sourcePage: '/contact/?product=ARC-C25&request=datasheet',
  });
  expect(submitted.submittedAt).toEqual(expect.any(String));
  await expect(page.getByLabel('Product / Model')).toHaveValue('ARC-C25');
  await expect(page.getByLabel('I need')).toHaveValue('datasheet');
});

test('contact accepts phone alone and sends the currently selected family and intent', async ({ page }) => {
  let submitted: Record<string, unknown> = {};
  await page.route('**/inquiry', async (route) => {
    submitted = JSON.parse(route.request().postData() || '{}');
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto('/contact/?product=ARC-C25&request=datasheet');
  await page.getByLabel('Product / Model').selectOption('truck-mounted-work-platforms');
  await page.getByLabel('I need').selectOption('advice');
  await page.getByLabel('Name').fill('Jane Buyer');
  await page.getByLabel('WhatsApp / Phone').fill('+1 416 555 0198');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  expect(submitted).toMatchObject({
    email: '', phone: '+1 416 555 0198', model: 'truck-mounted-work-platforms',
    product: 'truck-mounted-work-platforms', requestType: 'advice',
  });
});

test('contact query choices are allowlisted and family URLs retain their visible context', async ({ page }) => {
  await page.goto('/contact/?family=crawler-ceiling-platforms&request=advice');
  await expect(page.getByLabel('Product / Model')).toHaveValue('crawler-ceiling-platforms');
  await expect(page.getByLabel('I need')).toHaveValue('advice');
  await page.goto('/contact/?product=%3Cscript%3Ebad%3C%2Fscript%3E&request=download-now');
  await expect(page.getByLabel('Product / Model')).toHaveValue('Not sure');
  await expect(page.getByLabel('I need')).toHaveValue('quote');
  const values = await page.getByLabel('Product / Model').locator('option').evaluateAll(nodes => nodes.map(node => (node as HTMLOptionElement).value));
  expect(values).toHaveLength(20);
  expect(values).toContain('truck-mounted-work-platforms');
  expect(values).toContain('ARC-RF8');
});

test('primary delivery failure preserves all contact values', async ({ page }) => {
  let attempts = 0;
  await page.route('**/inquiry', (route) => {
    attempts += 1;
    return route.fulfill({
      status: attempts === 1 ? 502 : 200,
      contentType: 'application/json',
      body: JSON.stringify(attempts === 1 ? { ok: false, code: 'PRIMARY_DELIVERY_FAILED' } : { ok: true }),
    });
  });
  await page.goto('/contact/?product=crawler-roll-forming-lifts&request=advice');
  await page.getByLabel('Name').fill('Jane Buyer');
  await page.getByLabel('Email').fill('jane@roof.test');
  await page.getByLabel('WhatsApp / Phone').fill('+1 416 555 0198');
  await page.getByLabel('Company').fill('Roof Systems Ltd.');
  await page.getByLabel('Message').fill('Preserve this project message.');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByRole('alert')).toContainText('could not be sent');
  await expect(page.getByLabel('Name')).toHaveValue('Jane Buyer');
  await expect(page.getByLabel('Company')).toHaveValue('Roof Systems Ltd.');
  await expect(page.getByLabel('Message')).toHaveValue(
    'Preserve this project message.',
  );
  await expect(page.getByLabel('Product / Model')).toHaveValue('crawler-roll-forming-lifts');
  await expect(page.getByLabel('I need')).toHaveValue('advice');
  await page.getByRole('button', { name: /Send Request/ }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  expect(attempts).toBe(2);
});

test('default product InquiryForm renders the full field set and preserves validation', async ({
  page,
}) => {
  let submitted: Record<string, unknown> = {};
  await page.route('**/inquiry', async (route) => {
    submitted = JSON.parse(route.request().postData() || '{}') as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, requestId: 'product-browser-test-1' }),
    });
  });

  await page.goto('/__tests__/product-inquiry/');
  const form = page.locator('#inquiry-form');
  await expect(form).toHaveAttribute('data-form-variant', 'product');

  await expect(page.getByLabel('Full Name')).toBeVisible();
  await expect(page.getByLabel('Company')).toBeVisible();
  await expect(page.getByLabel('Country / Region')).toBeVisible();
  await expect(page.getByLabel('Product / Model')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('WhatsApp / Phone')).toBeVisible();
  await expect(page.getByLabel('Application')).toBeVisible();
  await expect(page.getByLabel('Project Requirements')).toBeVisible();
  await expect(page.getByLabel('Product / Model')).toHaveValue('ARC-C25');

  await page.getByRole('button', { name: 'Submit Inquiry' }).click();
  await expect(page.getByText('Please enter your full name.')).toBeVisible();
  await expect(page.getByText('Please enter your company name.')).toBeVisible();
  await expect(page.getByText('Please select your country.')).toBeVisible();
  await expect(page.getByText('Please describe your project requirements.')).toBeVisible();
  await expect(
    page.getByText('Enter an email address or WhatsApp/phone number.'),
  ).toBeVisible();

  await page.getByLabel('Full Name').fill('Jane Buyer');
  await page.getByLabel('Company').fill('Roof Systems Ltd.');
  await page.getByLabel('Country / Region').selectOption('Canada');
  await page.getByLabel('Project Requirements').fill('Eave height 22 m and 0.8 mm sheet.');
  await page.getByRole('button', { name: 'Submit Inquiry' }).click();
  await expect(
    page.getByText('Enter an email address or WhatsApp/phone number.'),
  ).toBeVisible();

  await page.getByLabel('Email').fill('not-an-email');
  await page.getByRole('button', { name: 'Submit Inquiry' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();

  await page.getByLabel('Email').fill('jane@roof.test');
  await page.getByRole('button', { name: 'Submit Inquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  expect(submitted).toMatchObject({
    formVariant: 'product',
    name: 'Jane Buyer',
    company: 'Roof Systems Ltd.',
    country: 'Canada',
    email: 'jane@roof.test',
    phone: '',
    model: 'ARC-C25',
    application: '',
    message: 'Eave height 22 m and 0.8 mm sheet.',
    product: 'ARC-C25 Crawler Roll Forming Lift',
    productSlug: 'arc-c25-crawler-roll-forming-lift',
    sourcePage: '/__tests__/product-inquiry/',
  });
});

test('mobile contact form has no page-level horizontal overflow', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/contact/');
  const sizes = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(sizes.documentWidth).toBeLessThanOrEqual(sizes.viewportWidth);
  await expect(
    page.getByRole('button', { name: /Send Request/ }),
  ).toBeVisible();
});
