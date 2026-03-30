import { test, expect } from '../fixtures/test.fixture';
import { generateRandomName, generateTestData } from '../utils/test-data';
import { handleCookies, waitForSuccess } from '../utils/ui-helpers';

test('Complete Signup → Wishlist → Logout → Login', async ({
  page,
  homePage,
  signupModal,
  profileModal,
  loginModal,
  navbar,
  wishlistPage,
  productPage,
  cartPopup
  }) => {
  const { email, password } = generateTestData();
  const { firstName, lastName } = generateRandomName();

  await homePage.open();
  await homePage.allowSelectedIfPresent();
  await homePage.switchLanguageToEnglish();

  await homePage.clickSignUp();
  await homePage.clickContinueWithEmail();

  await signupModal.waitForVisible();
  await signupModal.fillEmail(email);
  await signupModal.fillPassword(password);
  await signupModal.clickNext();

  await profileModal.waitForVisible();
  await profileModal.fillFirstName(firstName);
  await profileModal.fillLastName(lastName);
  await profileModal.selectDOB();
  await profileModal.selectRandomGender();
  await profileModal.acceptTerms();
  await profileModal.continue();

  await waitForSuccess(page);

  await navbar.verifyAuthenticated();
  await navbar.logout();

  await homePage.switchLanguageToEnglish();
  await homePage.reload();

  await homePage.clickLogin();
  await loginModal.waitForVisible();
  await loginModal.clickContinueWithEmail();

  await loginModal.loginWithWrongPassword(email);
  await loginModal.loginWithPassword(email, password);

  await waitForSuccess(page);

  await page.reload();
  await navbar.verifyAuthenticated();

  await wishlistPage.createWishlist();

  const newWishBtn = page.getByTestId('new-wish-btn');

  await expect(newWishBtn).toBeVisible({ timeout: 10000 });
  await expect(newWishBtn).toBeEnabled({ timeout: 10000 });

  await newWishBtn.click();

  const exploreMoreBtn = page
    .locator('[data-testid="new-wish-modal"]')
    .getByRole('button', { name: 'Explore more' });

  await exploreMoreBtn.click();

  await productPage.selectRandomPopularWish();
  await productPage.clickAddWishOnPDP();
  await productPage.selectMyWishlistFromPopover();

  await productPage.addTwoRandomProductsToMyWishlist();

  await wishlistPage.openOverview();
  await wishlistPage.openRandomWishlistWithItems();
  await wishlistPage.openRandomProductFromWishlist();

  await productPage.goToStore();
  await productPage.addToCartOnStore();

  await handleCookies(page);
  await page.keyboard.press('Escape').catch(() => {});

  await cartPopup.verifyOpened();
  await cartPopup.verifyActionsVisible();
  await cartPopup.verifyNextButton();
});