import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { BASE_URL, PASSWORD, USERNAME } from '../../utils/envConfig';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { checkoutData } from '../../test-data/checkoutData';
import { productsToCart } from '../../test-data/products';
import { FinalPage } from '../../pages/FinalPage';


test.describe('Final page tests', () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverviewPage : CheckoutOverviewPage
    let finalPage : FinalPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);
        finalPage = new FinalPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.clickOnCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckOutDetails(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
        await checkoutPage.clickContinue();
        await checkoutOverviewPage.clickFinishButton()
    })

    test('Validate final page elements', async({page}) => {
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html");
        const elements = await finalPage.getFinalpageElements();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.successMsg).toBeVisible();
        await expect(elements.backHomeButton).toBeVisible();
    })
      
    test('Validate success message', async() => {
        const message = await finalPage.getSuccessMsgText();
        expect (message).toBe("Thank you for your order!");
    })

    test('Validate back home button functionality', async({page}) => {
        await finalPage.clickOnBackHomeButton();
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    })
})