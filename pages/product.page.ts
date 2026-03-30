import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { handleCookies } from '../utils/ui-helpers';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectRandomPopularWish() {
    const cards = this.page.locator(
      '[data-testid="brand-popular-products-grid"] [data-testid="wishCardContainer"]'
    );

    await cards.first().waitFor({ state: 'visible' });

    const count = await cards.count();
    if (count === 0) throw new Error('No products found');

    const randomIndex = Math.floor(Math.random() * count);
    const randomCard = cards.nth(randomIndex);

    await randomCard.scrollIntoViewIfNeeded();

    const link = randomCard.locator('a');
    await link.click({ force: true });

    console.log(`Clicked random product at index: ${randomIndex}`);
  }

  async clickAddWishOnPDP() {
    const addWishOnPDP = this.page.getByTestId('add-wishlist-button');

    await expect(this.page.getByTestId('wish-title')).toBeVisible({ timeout: 10000 });
    await expect(addWishOnPDP).toBeVisible({ timeout: 10000 });

    await addWishOnPDP.scrollIntoViewIfNeeded();
    await addWishOnPDP.click();

    console.log('Add Wish clicked successfully');
  }

  async selectMyWishlistFromPopover() {
    const wishlistPopover = this.page.getByTestId('wishlists-select');
    await expect(wishlistPopover).toBeVisible({ timeout: 10000 });

    const myWishlist = this.page.getByTestId('select-wishlist-list-item-0');

    await expect(myWishlist).toBeVisible({ timeout: 10000 });
    await myWishlist.scrollIntoViewIfNeeded();
    await myWishlist.click();

    console.log('My Wishlist selected');
  }

  async goToStore() {
    const goToStoreBtn = this.page
    .getByTestId('wish-or-product-details')
    .getByRole('button', { name: 'Go to store' });

    await expect(goToStoreBtn).toBeVisible({ timeout: 10000 });

    let newPage: Page | null = null;

    try {
    const [page] = await Promise.all([
      this.page.context().waitForEvent('page'),
      goToStoreBtn.click(),
    ]);
    newPage = page;
    } catch {
    await goToStoreBtn.click();
    }

    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded');
      this.page = newPage;
      console.log('Store opened in NEW TAB');
    } else {
        await this.page.waitForLoadState('domcontentloaded');
        console.log('Store opened in SAME TAB');
    }
  }

  async addToCartOnStore() {
    await this.page.waitForLoadState('domcontentloaded');

  // MUST be here
    await handleCookies(this.page);

    const addToCartBtn = this.page.locator(
    'button:has-text("Add"), button:has-text("Buy")'
    ).first();

    await expect(addToCartBtn).toBeVisible({ timeout: 15000 });
    await addToCartBtn.click();
  }

  async addTwoRandomProductsToMyWishlist() {
    const openExploreMore = async () => {
      const exploreMoreBtn = this.page
        .locator('[data-testid="new-wish-modal"]')
        .getByRole('button', { name: 'Explore more' });

      if (await exploreMoreBtn.isVisible().catch(() => false)) {
        await exploreMoreBtn.click();
      } else {
        await this.page.goBack();
      }
    };

    await openExploreMore();
    await this.selectRandomPopularWish();
    await this.clickAddWishOnPDP();
    await this.selectMyWishlistFromPopover();

    const exploreMoreAgain = this.page
      .locator('[data-testid="new-wish-modal"]')
      .getByRole('button', { name: 'Explore more' });

    if (await exploreMoreAgain.isVisible().catch(() => false)) {
      await exploreMoreAgain.click();
    } else {
      await this.page.goBack();
    }

    await this.selectRandomPopularWish();

    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByTestId('wish-title')).toBeVisible({ timeout: 15000 });

    const addWishSecond = this.page.getByTestId('add-wishlist-button');
    await expect(addWishSecond).toBeVisible({ timeout: 10000 });

    await addWishSecond.click({ trial: true }); // ensure it's interactable
    await addWishSecond.click();

    console.log('Second product Add Wish clicked');

    const wishlistPopoverSecond = this.page.getByTestId('wishlists-select');
    await expect(wishlistPopoverSecond).toBeVisible({ timeout: 10000 });

    const myWishlistSecond = this.page.getByTestId('select-wishlist-list-item-0');

    await expect(myWishlistSecond).toBeVisible({ timeout: 10000 });
    await myWishlistSecond.scrollIntoViewIfNeeded();
    await myWishlistSecond.click();

    console.log('Second product added to My Wishlist');
  }
}