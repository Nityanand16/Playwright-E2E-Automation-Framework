import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SignupModal } from '../pages/signup.modal';
import { ProfileModal } from '../pages/profile.modal';
import { LoginModal } from '../pages/login.modal';
import { NavbarComponent } from '../pages/navbar.component';
import { WishlistPage } from '../pages/wishlist.page';
import { ProductPage } from '../pages/product.page';
import { CartPopup } from '../pages/cart.popup';

type Fixtures = {
  homePage: HomePage;
  signupModal: SignupModal;
  profileModal: ProfileModal;
  loginModal: LoginModal;
  navbar: NavbarComponent;
  wishlistPage: WishlistPage;
  productPage: ProductPage;
  cartPopup: CartPopup;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signupModal: async ({ page }, use) => {
    await use(new SignupModal(page));
  },

  profileModal: async ({ page }, use) => {
    await use(new ProfileModal(page));
  },

  loginModal: async ({ page }, use) => {
    await use(new LoginModal(page));
  },

  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },

  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPopup: async ({ page }, use) => {
    await use(new CartPopup(page));
  },
});

export { expect } from '@playwright/test';