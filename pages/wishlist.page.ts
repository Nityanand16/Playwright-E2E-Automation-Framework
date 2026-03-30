import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class WishlistPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createWishlist() {
    const plusBtn = this.page.locator('[data-testid="plus-button"]').nth(1);
    await plusBtn.click();

    await this.page.getByTestId('wl-forMe').click();
    await this.page.getByTestId('createWishlistSubmitButton').click();
  }

  async openOverview() {
    await this.page.goto('/overview').catch(async () => {
      await this.page.goto('/');
    });

    await expect(this.page).toHaveURL(/overview|home|dashboard/, { timeout: 10000 });
  }

  async openRandomWishlistWithItems() {
    const wishlistSection = this.page.getByTestId('carouselWishlists');
    const wishlistCards = wishlistSection.locator('.WishlistCard__CardContainer-sc-4d33b65-6');

    await expect(wishlistCards.first()).toBeVisible({ timeout: 10000 });

    const validIndexes: number[] = [];
    const totalCards = await wishlistCards.count();

    for (let i = 0; i < totalCards; i++) {
      const card = wishlistCards.nth(i);
      const counter = card.locator('.WishCounter__Container-sc-527ada2c-0');

      if (await counter.isVisible().catch(() => false)) {
        const text = await counter.innerText();
        const countValue = parseInt(text.trim(), 10);

        if (!isNaN(countValue) && countValue > 0) {
          validIndexes.push(i);
        }
      }
    }

    if (validIndexes.length === 0) {
      throw new Error('No wishlist with product count > 0 found');
    }

    const randomValidIndex =
      validIndexes[Math.floor(Math.random() * validIndexes.length)];

    const selectedWishlist = wishlistCards.nth(randomValidIndex);

    await selectedWishlist.scrollIntoViewIfNeeded();
    await selectedWishlist.click();

    console.log(`Clicked wishlist with count > 0 at index: ${randomValidIndex}`);
  }

  async openRandomProductFromWishlist() {
    //wait for wishlist page/content to load
    await this.page.waitForLoadState('domcontentloaded');

    //wait until at least one product appears
    const productCards = this.page.locator('span[class*="wish-card-"]');

    await expect
      .poll(async () => await productCards.count(), { timeout: 10000 })
      .toBeGreaterThan(0);

    await expect(productCards.first()).toBeVisible({ timeout: 10000 });

    const productCount = await productCards.count();

    if (productCount === 0) {
      throw new Error('No products found');
    }

    const productRandomIndex = Math.floor(Math.random() * productCount);
    const randomProduct = productCards.nth(productRandomIndex);

    await randomProduct.scrollIntoViewIfNeeded();
    await randomProduct.click();

    console.log(`Clicked random product at index: ${productRandomIndex}`);
  }
}