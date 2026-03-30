import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { handleOptionalContinue } from '../utils/ui-helpers'; // ✅ added import

export class NavbarComponent extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyAuthenticated() {
    const authAvatar = this.page.getByTestId('navbarUserProfileAvatar');
    const authHeader = this.page.locator('[data-testid="user-profile-header"]');

    await expect(authAvatar).toBeVisible({ timeout: 10000 });
    await expect(authHeader).toBeVisible({ timeout: 10000 });
  }

  async logout() {
    // ✅ handle blocking overlay (root cause fix)
    await handleOptionalContinue(this.page);

    const continueOnWeb = this.page.getByText('CONTINUE ON WEB', { exact: false });

  if (await continueOnWeb.isVisible().catch(() => false)) {
  await continueOnWeb.click();
  await expect(this.page.getByText('CONTINUE ON WEB', { exact: false })).toBeHidden({
    timeout: 10000,
  });
  }

    // ✅ ensure avatar is clickable
    const avatar = this.page.getByTestId('navbarUserProfileAvatar');

  if (!(await avatar.isVisible().catch(() => false))) {
  throw new Error('User not logged in — avatar not found. Signup failed.');
  }

  await avatar.click();

    const drawer = this.page.locator('.ant-drawer-open');
    await drawer.getByRole('button', { name: 'Log out' }).click();
    await expect(drawer).toBeHidden();
  }
}