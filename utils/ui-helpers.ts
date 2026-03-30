import { expect, Locator, Page } from '@playwright/test';

export async function selectRandomVisibleOption(page: Page, trigger: Locator) {
  await trigger.click();

  const dropdown = page.locator('.ant-select-dropdown:visible').last();
  await expect(dropdown).toBeVisible({ timeout: 10000 });

  const options = dropdown.locator('.ant-select-item-option');
  const count = await options.count();

  if (count === 0) throw new Error('No dropdown options');

  const validIndexes: number[] = [];

  for (let i = 0; i < count; i++) {
    const option = options.nth(i);

    const isVisible = await option.isVisible().catch(() => false);
    const isDisabled = await option.getAttribute('aria-disabled').catch(() => null);

    if (isVisible && isDisabled !== 'true') {
      validIndexes.push(i);
    }
  }

  if (validIndexes.length === 0) {
    throw new Error('No visible clickable dropdown options');
  }

  const randomIndex =
    validIndexes[Math.floor(Math.random() * validIndexes.length)];

  //wait for dropdown animation/render to settle
  const freshOptions = dropdown.locator('.ant-select-item-option');
  const freshCount = await freshOptions.count();

  if (freshCount === 0) {
  throw new Error('Dropdown disappeared before selection');
  }

  const freshIndex = Math.floor(Math.random() * freshCount);
  const selectedOption = freshOptions.nth(freshIndex);

  await expect(selectedOption).toBeVisible({ timeout: 10000 });
  await selectedOption.click({ force: true });
}

  // ============================
  // NEW HELPER
  // ============================
export async function waitForModalAndClick(
  page: Page,
  modalTestId: string,
  buttonName: string
  ) {
  const modal = page.locator(`[data-testid="${modalTestId}"]`);

  await expect(modal).toBeAttached({ timeout: 10000 });
  await expect(modal).toBeVisible({ timeout: 10000 });

  const button = modal.getByRole('button', { name: buttonName });

  await expect(button).toBeVisible({ timeout: 10000 });
  await expect(button).toBeEnabled({ timeout: 10000 });

  await button.click();
}

  // ============================
  // OPTIONAL CONTINUE BUTTON
  // ============================
export async function handleOptionalContinue(page: Page) {
  const continueBtn = page.locator('div[class*="ContinueOnWebButton"]');

  if (await continueBtn.isVisible().catch(() => false)) {
    await continueBtn.click();
    console.log('Clicked Continue on Web');
  }
}

  // ============================
  // SUCCESS HANDLER
  // ============================
export async function waitForSuccess(page: Page) {
  const userHeader = page.locator('[data-testid="user-profile-header"]');
  const avatar = page.getByTestId('navbarUserProfileAvatar');
  const redirectUrl = /overview|home|dashboard/;

  await handleOptionalContinue(page);

  await expect
  .poll(
    async () => {
      await handleOptionalContinue(page);

      // 1. URL check (fast path)
      if (/overview|home|dashboard/.test(page.url())) return true;

      // 2. Logged-in UI indicators
      const userAvatarVisible = await page
        .locator('button:has-text("TU")')
        .isVisible()
        .catch(() => false);

      const navbarProfileVisible = await page
        .getByRole('button', { name: /TU|profile/i })
        .isVisible()
        .catch(() => false);

      const wishlistButtonVisible = await page
        .getByTestId('new-wish-btn')
        .isVisible()
        .catch(() => false);

      return (
        userAvatarVisible ||
        navbarProfileVisible ||
        wishlistButtonVisible
      );
    },
    { timeout: 30000 } // ✅ reduce unnecessary long wait
  )
  .toBeTruthy();
}

  // ============================
  // COOKIES HELPER
  // ============================
export async function handleCookies(page: Page): Promise<boolean> {
  const targets = [
    page.getByRole('button', { name: /^OK$/i }),
    page.getByRole('button', {
      name: /^(Allow all|Accept all|Tillad alle|Accepter alle)$/i,
    }),
    page.getByRole('button', { name: /OK|Allow|Accept|Tillad|Accepter/i }),
    page.locator('#onetrust-accept-btn-handler'),
    page.locator('.coi-banner__accept'),
    page.locator('[aria-label="OK"]'),
    page.locator('[aria-label*="Accept" i]'),
    page.locator('[aria-label*="Allow" i]'),
  ];

  for (const target of targets) {
    try {
      if (await target.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await target.first().click({ timeout: 3000 });
        console.log('Cookies accepted');
        return true;
      }
    } catch {}
  }

  for (const frame of page.frames()) {
    const frameTargets = [
      frame.getByRole('button', { name: /^OK$/i }),
      frame.getByRole('button', { name: /OK|Allow|Accept|Tillad|Accepter/i }),
      frame.locator('#onetrust-accept-btn-handler'),
      frame.locator('.coi-banner__accept'),
    ];  

    for (const target of frameTargets) {
      try {
        if (await target.first().isVisible({ timeout: 1000 }).catch(() => false)) {
          await target.first().click({ timeout: 3000 });
          console.log('Cookies accepted (iframe)');
          return true;
        }
      } catch {}
    }
  }

  return false;

}

export async function selectGender(page: Page) {
  const genderDropdown = page.locator('.ant-select-selector').last();

  await expect(genderDropdown).toBeVisible({ timeout: 15000 });
  await genderDropdown.click();

  const dropdown = page.locator('.ant-select-dropdown:visible').last();
  await expect(dropdown).toBeVisible({ timeout: 15000 });

  const options = dropdown.locator('.ant-select-item-option:not([aria-disabled="true"])');

  const count = await options.count();
  if (count === 0) throw new Error('No gender options found');

  const option = options.first();

  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click();

  await expect(genderDropdown).not.toContainText('Select gender', { timeout: 10000 });
}