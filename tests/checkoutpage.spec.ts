import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { BASE_URL, PASSWORD, USERNAME } from '../utils/envConfig';
import { CartPage } from '../pages/CartPage';
import { checkoutData } from '../test-data/checkoutData';
import { CheckoutPage } from '../pages/CheckoutPage';


test.describe('Checkout page tests', () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.addFirstProductToCart();
        await productPage.clickOnCartLink();
    })

    test('Validate checkout page elements', async({page}) => {
        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-one.html");
        const elements = await checkoutPage.getCheckoutElements();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.continue).toBeVisible();
        await expect(elements.cancel).toBeVisible();
    })

    test('Validate cancel button functionality', async({page}) => {
        await cartPage.clickCheckoutButton();
        await checkoutPage.clickCancel();
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    })

    test('Validate continue button', async() => {
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckOutDetails(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
        await checkoutPage.clickContinue();
    })

    test('Validate continue button providing no data', async() => {
        await cartPage.clickCheckoutButton();
        await checkoutPage.clickContinue();
        const error = await checkoutPage.getErrorMessage();
        expect (error?.trim()).toBe("Error: First Name is required");
    })
})