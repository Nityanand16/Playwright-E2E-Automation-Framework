import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { selectRandomVisibleOption } from '../utils/ui-helpers';

export class ProfileModal extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get modal() {
    return this.page.locator('[role="dialog"]').filter({
      has: this.page.locator('[data-cy="registerFirstNameInput"]'),
    });
  }

  async waitForVisible() {
    await expect(this.modal).toBeVisible();
  }

  async fillFirstName(firstName: string) {
    await this.modal.locator('[data-cy="registerFirstNameInput"]').fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.modal.locator('[data-cy="registerLastNameInput"]').fill(lastName);
  }

  private async selectYear(validYear: number) {
    const yearDropdown = this.modal.locator('#registerSelectYear');
    await yearDropdown.click();

    const yearPopup = this.page.locator('.ant-select-dropdown:visible').last();
    await expect(yearPopup).toBeVisible({ timeout: 5000 });

    const yearListHolder = yearPopup.locator('.rc-virtual-list-holder').first();
    const yearText = validYear.toString();

    let selected = false;

    for (let attempt = 0; attempt < 40; attempt++) {
      const yearOption = yearPopup
        .locator('.ant-select-item-option-content')
        .filter({ hasText: yearText })
        .first();

      if (await yearOption.count()) {
        await expect(yearOption).toBeVisible({ timeout: 1000 });
        await yearOption.click();
        selected = true;
        break;
      }

      await yearListHolder.evaluate((el) => {
        el.scrollTop += Math.floor(el.clientHeight * 0.85);
      }).catch(() => {});

      await this.page.waitForTimeout(150);
      }

      if (!selected) {
      throw new Error(`Could not select year ${yearText}`);
      }
    }

  async selectDOB() {
    const today = new Date();
    const maxYear = today.getFullYear() - 13;
    const minYear = maxYear - 60;

    const validYear = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;

    await selectRandomVisibleOption(this.page, this.modal.locator('#registerSelectMonth'));
    await selectRandomVisibleOption(this.page, this.modal.locator('#registerSelectDay'));
    await this.selectYear(validYear);
  }

  async selectRandomGender() {
    const genderDropdown = this.modal.locator('.ant-select-selector').last();

    await expect(genderDropdown).toBeVisible({ timeout: 15000 });
    await genderDropdown.click();

    const dropdown = this.page.locator('.ant-select-dropdown:visible').last();
    await expect(dropdown).toBeVisible({ timeout: 15000 });

    const options = dropdown.locator('.ant-select-item-option:not([aria-disabled="true"])');

    const count = await options.count();
    if (count === 0) throw new Error('No gender options found');

      const visibleOption = dropdown
      .locator('.ant-select-item-option-content')
      .filter({ hasText: /Female|Male|Other/ })
      .first();

    await expect(visibleOption).toBeVisible({ timeout: 10000 });
    await visibleOption.click({ force: true });

    await expect(genderDropdown).not.toContainText('Select gender', {
    timeout: 10000,
  });
  }

  async acceptTerms() {
    await this.modal.locator('input.ant-checkbox-input').check();
  }

  async continue() {
    await this.modal.locator('[data-cy="registerNameNextButton"]').click();

  //WAIT FOR MODAL TO CLOSE (this = signup success)
    await expect(this.modal).toBeHidden({ timeout: 20000 });
  }
}