import { CartPageLocators } from '../locators/CartPageLocators';
import { Page } from '@playwright/test';

export class CartPage {

    constructor(private page: Page) {

    }

    async clickOnContinueShopping() {
        await this.page.locator(CartPageLocators.continueShoppingButton).click();
    }

    async getCartPageElements() {
        return {
            cartTitle: this.page.locator(CartPageLocators.cartTitle),
            shoppingCart: this.page.locator(CartPageLocators.continueShoppingButton),
            checkout: this.page.locator(CartPageLocators.checkoutButton)
        }
    }

    async getCartProducts() {
        const allNames = await this.page.locator(CartPageLocators.productNames).allTextContents();
        const allDescriptions = await this.page.locator(CartPageLocators.productDescriptions).allTextContents();
        const allPrices = await this.page.locator(CartPageLocators.productPrices).allTextContents();

        const allCartProducts = allNames.map((_, i) => ({
            name: allNames[i].trim(),
            description: allDescriptions[i].trim(),
            price: allPrices[i].trim()
        }))
        return allCartProducts;
    }

    async removeFirstProduct() {
        await this.page.locator(CartPageLocators.removeButton).first().click();
    }

    async clickCheckoutButton() {
        await this.page.locator(CartPageLocators.checkoutButton).click();
    }
}