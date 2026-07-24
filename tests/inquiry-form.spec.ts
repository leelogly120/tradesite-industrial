import { expect, test } from '@playwright/test';

test('contact keeps the compact legacy field set and dimensions', async ({ page }) => {
  await page.goto('/contact/?product=ARC-C25');

  const form = page.locator('#inquiry-form');
  await expect(form).toHaveAttribute('data-form-variant', 'contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('WhatsApp / Phone')).toBeVisible();
  await expect(page.getByLabel('Company')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
  await expect(page.getByLabel('Country / Region')).toHaveCount(0);
  await expect(page.getByLabel('Product / Model')).toHaveCount(0);
  await expect(page.getByLabel('Application')).toHaveCount(0);
  await expect(page.getByLabel('Project Requirements')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: /Submit Quote Request/ }),
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
  expect(dimensions.formWidth).toBeLessThanOrEqual(434);
  expect(dimensions.inputHeight).toBe(54);
  expect(dimensions.textareaHeight).toBe(100);
  expect(dimensions.buttonHeight).toBe(58);

  await expect(page.getByLabel('Name')).toHaveAttribute('placeholder', 'Your full name');
  await expect(page.getByLabel('Email')).toHaveAttribute('placeholder', 'your@email.com');
  await expect(page.getByLabel('WhatsApp / Phone')).toHaveAttribute(
    'placeholder',
    '+86 156 1768 7185',
  );
  await expect(page.getByLabel('Company')).toHaveAttribute(
    'placeholder',
    'Your company name',
  );
  await expect(page.getByLabel('Message')).toHaveAttribute(
    'placeholder',
    'Tell us about your project requirements, working height, load capacity, site conditions...',
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

test('contact requires name, valid email and phone while optional fields may stay empty', async ({
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

  await page.goto('/contact/?product=ARC-C25');
  await page.getByRole('button', { name: /Submit Quote Request/ }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
  await expect(page.getByText('Please enter your email address.')).toBeVisible();
  await expect(
    page.getByText('Please enter your WhatsApp/phone number.'),
  ).toBeVisible();

  await page.getByLabel('Name').fill('Jane Buyer');
  await page.getByLabel('Email').fill('not-an-email');
  await page.getByLabel('WhatsApp / Phone').fill('+1 416 555 0198');
  await page.getByRole('button', { name: /Submit Quote Request/ }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();

  await page.getByLabel('Email').fill('jane@roof.test');
  await page.getByRole('button', { name: /Submit Quote Request/ }).click();
  await expect(page.getByRole('status')).toContainText('Thank you');
  expect(submitted).toMatchObject({
    formVariant: 'contact',
    name: 'Jane Buyer',
    email: 'jane@roof.test',
    phone: '+1 416 555 0198',
    company: '',
    message: '',
    product: 'ARC-C25',
    sourcePage: '/contact/?product=ARC-C25',
  });
  expect(submitted.submittedAt).toEqual(expect.any(String));
});

test('primary delivery failure preserves all contact values', async ({ page }) => {
  await page.route('**/inquiry', (route) =>
    route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, code: 'PRIMARY_DELIVERY_FAILED' }),
    }),
  );
  await page.goto('/contact/');
  await page.getByLabel('Name').fill('Jane Buyer');
  await page.getByLabel('Email').fill('jane@roof.test');
  await page.getByLabel('WhatsApp / Phone').fill('+1 416 555 0198');
  await page.getByLabel('Company').fill('Roof Systems Ltd.');
  await page.getByLabel('Message').fill('Preserve this project message.');
  await page.getByRole('button', { name: /Submit Quote Request/ }).click();
  await expect(page.getByRole('alert')).toContainText('could not be sent');
  await expect(page.getByLabel('Name')).toHaveValue('Jane Buyer');
  await expect(page.getByLabel('Company')).toHaveValue('Roof Systems Ltd.');
  await expect(page.getByLabel('Message')).toHaveValue(
    'Preserve this project message.',
  );
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
    page.getByRole('button', { name: /Submit Quote Request/ }),
  ).toBeVisible();
});