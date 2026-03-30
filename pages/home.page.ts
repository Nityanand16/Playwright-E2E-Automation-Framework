import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto('/');
  }

  async reload() {
    await this.page.reload();
  }

  async allowSelectedIfPresent() {
    try {
      await this.page.getByRole('button', { name: 'Allow selected' }).click();
    } catch {}
  }

  async switchLanguageToEnglish() {
    const langSelector = this.page.getByTestId('navbarLanguageSelector');
    await expect(langSelector).toBeVisible();
    await langSelector.click();

    const englishOption = this.page
      .getByTestId('languageText')
      .filter({ hasText: 'English' });

    await expect(englishOption).toBeVisible();
    await englishOption.click();
  }

  async clickSignUp() {
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  async clickContinueWithEmail() {
  const continueBtn = this.page
  .getByRole('dialog')
  .getByRole('button', { name: 'Continue with e-mail' });

  await expect(continueBtn).toBeVisible({ timeout: 10000 });
  await continueBtn.click();
  }

  async clickLogin() {
  // replaced part
  if (this.page.isClosed()) {
    throw new Error('Page was closed before clicking login');
  }

  await this.page.waitForLoadState('load');
  await this.page.waitForTimeout(500);

  // existing code (UNCHANGED)
  try {
    await this.page.locator('.coi-banner__accept').click({ timeout: 2000 });
  } catch {}

  const loginBtn = this.page.locator('button', { hasText: 'Log in' });

  await expect(loginBtn).toBeVisible({ timeout: 15000 });
  await loginBtn.click();
  }
}