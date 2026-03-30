import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginModal extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get modal() {
    return this.page.locator('[role="dialog"]');
  }

  async waitForVisible() {
    await expect(this.modal).toBeVisible({ timeout: 10000 });
  }

  async clickContinueWithEmail() {
    const continueEmailBtn = this.modal.locator('button:has-text("Continue with e-mail")');
    await expect(continueEmailBtn).toBeVisible();
    await this.page.waitForTimeout(200); // optional but recommended
    await continueEmailBtn.click({ force: true });
  }

  async loginWithWrongPassword(email: string) {
    const emailInput = this.modal.locator('[data-cy="signupEmailInput"]');
    const passwordInput = this.modal.getByTestId('loginPasswordInput');
    const loginSubmitBtn = this.modal.getByRole('button', { name: 'Log in' });

    await emailInput.fill(email);
    await passwordInput.fill('WrongPassword123');
    await loginSubmitBtn.click();

    await expect(this.page.locator('[data-cy="login-error-message"]')).toBeVisible();
  }

  async loginWithPassword(email: string, password: string) {
    const emailInput = this.modal.locator('[data-cy="signupEmailInput"]');
    const passwordInput = this.modal.getByTestId('loginPasswordInput');
    const loginSubmitBtn = this.modal.getByRole('button', { name: 'Log in' });

    await emailInput.fill(email);
    await passwordInput.fill(password);
    await loginSubmitBtn.click();
  }
}