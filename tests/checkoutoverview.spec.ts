import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { BASE_URL, PASSWORD, USERNAME } from '../utils/envConfig';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { checkoutData } from '../test-data/checkoutData';
import { productsToCart } from '../test-data/products';


test.describe('Checkout overview page tests', () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverviewPage : CheckoutOverviewPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutOverviewPage = new CheckoutOverviewPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.clickOnCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckOutDetails(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
        await checkoutPage.clickContinue();
    })

    test('Validate checkout overview page elements', async({page}) => {
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
        const elements = await checkoutOverviewPage.getCheckoutOverviewElements();
        await expect(elements.pageInfo).toBeVisible();
        await expect(elements.finishButton).toBeVisible();
        await expect(elements.cancelButton).toBeVisible();
    })
      
    test('Validate Cancel button functionality', async({page}) => {
        await checkoutOverviewPage.clickCancelButton();
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    })

          
    test('Validate Item total calculation', async() => {
        const overviewProducts = await checkoutOverviewPage.getOverviewProducts();
        const calculatedTotal = overviewProducts.reduce((sum, {price}) => sum + parseFloat(price.replace("$", "")) , 0);
        const uiItemTotal = await checkoutOverviewPage.getItemTotal();
        expect(calculatedTotal).toBe(uiItemTotal);
    })

    test('Validate Total Price (Item Total + Tax)', async() => {
        const itemTotal = await checkoutOverviewPage.getItemTotal();
        const tax = await checkoutOverviewPage.getTax();
        const finalTotal = await checkoutOverviewPage.getTotal();
        const expectedFinalTotal = itemTotal + tax;
        expect (expectedFinalTotal).toBe(finalTotal);
    })
})