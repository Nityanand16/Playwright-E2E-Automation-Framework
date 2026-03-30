import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SignupModal extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get modal() {
    return this.page.locator('[role="dialog"]').filter({
      has: this.page.locator('[data-cy="signupEmailInput"]'),
    });
  }

  async waitForVisible() {
    await expect(this.modal).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.modal.locator('[data-cy="signupEmailInput"]').fill(email);
  }

  async fillPassword(password: string) {
    await this.modal.locator('[data-cy="signupPasswordInput"]').fill(password);
  }

  async clickNext() {
    await this.modal.getByRole('button', { name: 'Next' }).click();
  }
}