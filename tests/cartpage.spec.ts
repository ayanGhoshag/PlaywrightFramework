import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { BASE_URL, PASSWORD, USERNAME } from '../utils/envConfig';
import { CartPage } from '../pages/CartPage';
import { productsToCart } from '../test-data/products';


test.describe('Cart page tests', () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD);
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    })

    test('Validate cart page url and elements', async({ page }) => {
        await productPage.addFirstProductToCart();
        await productPage.clickOnCartLink();
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
        const ui = cartPage.getCartPageElements();
        await expect((await ui).cartTitle).toBeVisible();
        await expect((await ui).shoppingCart).toBeVisible();
        await expect((await ui).checkout).toBeVisible();
    })

    test('Validate continue shopping functionality', async({ page }) => {
        await productPage.addFirstProductToCart();
        await productPage.clickOnCartLink();
        await cartPage.clickOnContinueShopping();
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })

    test('Validate first product added to the cart page', async () => {
        const firstProduct = await productPage.getFirstProductDetails();
        await productPage.addFirstProductToCart();
        await productPage.clickOnCartLink();
        const cartProducts = await cartPage.getCartProducts();
        expect (cartProducts[0]).toEqual(firstProduct);
    })


    test('Validate specific product added to the cart page', async() => {
        const specificProducts = await productPage.getSpecificProductDetails(productsToCart);
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.clickOnCartLink();
        const cartProducts = await cartPage.getCartProducts();
        expect (cartProducts).toEqual(specificProducts);
    })

    test('Validate all products added to the cart page', async() => {
        const allProducts = await productPage.getAllProductDetails();
        await productPage.addAllProductsToCart();
        await productPage.clickOnCartLink();
        const cartProducts = await cartPage.getCartProducts();
        expect (cartProducts).toEqual(allProducts);
    })

    test.only('Validate remove functionality in the cart page', async({ page }) => {
        await productPage.addFirstProductToCart();
        await productPage.clickOnCartLink();
        const initialProducts = await cartPage.getCartProducts();
        expect(initialProducts.length).toBeGreaterThan(0);
        await cartPage.removeFirstProduct();
        const updatedProducts = await cartPage.getCartProducts();
        expect(updatedProducts.length).toBe(initialProducts.length-1);
    })
})