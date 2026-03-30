import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPopup extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyOpened() {
    const cartDialog = this.page.locator('dialog[open]');
    await expect(cartDialog).toBeVisible({ timeout: 15000 });
    console.log('Cart popup opened');
  }

  async verifyActionsVisible() {
    const cartDialog = this.page.locator('dialog[open]');
    const popupActions = cartDialog.getByTestId('popup-actions');

    await expect(popupActions).toBeVisible();
  }

  async verifyNextButton() {
    const cartDialog = this.page.locator('dialog[open]');
    const popupActions = cartDialog.getByTestId('popup-actions');
    const nextButton = popupActions.getByRole('button', { name: /næste/i });

    await expect(nextButton).toBeVisible({ timeout: 10000 });
    console.log('Popup verified (Næste visible)');
  }
}