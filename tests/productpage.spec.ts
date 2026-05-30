import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../utils/envConfig';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';
import { LoginLocators } from '../locators/LoginLocators';
import { AboutPageLocators } from '../locators/AboutPageLocators';
import { ProductPageLocators } from '../locators/ProductPageLocators';
import { productsToCart } from '../test-data/products';

test.describe('Product page tests', () => {

    let loginPage: LoginPage
    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    })

    test('Validate Logout', async ({ page }) => {
        await productPage.logout();
        await expect(page.locator(LoginLocators.loginButton)).toBeVisible();
    })

    test('Validate About Page and Navigate Back', async ({ page }) => {
        await productPage.openAboutPage();
        await expect(page.locator(AboutPageLocators.tryItFreeButton)).toBeVisible();
        await page.goBack();
    })

    test('Validate product page layout', async ({ page }) => {
        await productPage.validateProductsDisplayed();
        await expect(page.locator(ProductPageLocators.addToCartButtons)).toHaveCount(6);
    })

    test('Validate add specific products to cart', async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);
        expect(await page.locator(ProductPageLocators.shoppingCartBadge).textContent()).toBe('3');
    })

    test('Filter Products By Name A to Z', async () => {
        await productPage.filterByNameAtoZ();
        const names = await productPage.getProductNames();
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
    })

    test('Filter Products By Name Z to A', async () => {
        await productPage.filterByNameZtoA();
        const names = await productPage.getProductNames();
        const sorted = [...names].sort().reverse();
        expect(names).toEqual(sorted);
    })

    test('Filter Products By Price High to Low', async () => {
        await productPage.filterBypriceHighToLow();
        const prices = await productPage.getProductPrices();
        const sorted = [...prices].sort((a,b) => b-a);
        expect (prices).toEqual(sorted);
    })

    test('Filter Products By Price Low to High', async () => {
        await productPage.filterByPriceLowToHigh();
        const prices = await productPage.getProductPrices();
        const sorted = [...prices].sort((a,b) => a-b);
        expect (prices).toEqual(sorted);
    })
})