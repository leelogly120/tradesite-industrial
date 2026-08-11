import { expect, test } from '@playwright/test';

test('keeps crawler selection path decision labels visually separated', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/images/editorial/crawler-platform-selection-path.svg');

  const labels = await page.locator('[data-role="decision-label"]').evaluateAll((elements) => (
    elements.map((element) => {
      const box = (element as SVGGraphicsElement).getBBox();
      return {
        text: element.textContent?.trim() ?? '',
        left: box.x,
        right: box.x + box.width,
      };
    })
  ));

  expect(labels).toHaveLength(5);
  for (let index = 0; index < labels.length - 1; index += 1) {
    const current = labels[index];
    const next = labels[index + 1];
    expect(
      current.right + 30,
      `${current.text} overlaps or crowds ${next.text}`,
    ).toBeLessThanOrEqual(next.left);
  }
});
