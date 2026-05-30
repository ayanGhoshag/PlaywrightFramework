import { Page } from "@playwright/test";
import { ProductPageLocators } from "../locators/ProductPageLocators";

export class ProductPage {

    constructor(private page: Page) {

    }

    async logout() {
        await this.page.click(ProductPageLocators.settingIcon);
        await this.page.click(ProductPageLocators.logoutLink);
    }

    async openAboutPage() {
        await this.page.click(ProductPageLocators.settingIcon);
        await this.page.click(ProductPageLocators.aboutLink);
    }

    async validateProductsDisplayed() {
        const names = await this.page.locator(ProductPageLocators.productNames).allTextContents();
        const descriptions = await this.page.locator(ProductPageLocators.productDescriptions).allTextContents();
        const prices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();
        const buttonCounts = await this.page.locator(ProductPageLocators.addToCartButtons).count();

        if (names.length === 0) {
            throw new Error("No products displayed");
        }
        if (names.length !== descriptions.length || names.length !== prices.length || names.length !== buttonCounts) {
            throw new Error("Mismatch between product details count")
        }
    }

    async addFirstProductToCart() {
        await this.page.locator(ProductPageLocators.addToCartButtons).first().click();
    }

    async addAllProductsToCart() {
        const buttons = this.page.locator(ProductPageLocators.addToCartButtons);
        const count = await buttons.count();
        for (let i = 0; i < count; i++) {
            await buttons.nth(i).click();
        }
    }

    async addSpecificProductsToCart(productName: string[]) {
        const addProducts = this.page.locator(ProductPageLocators.productNames);
        const count = await addProducts.count();
        for (let i = 0; i < count; i++) {
            const name = await addProducts.nth(i).textContent();
            if (name && productName.includes(name.trim())) {
                await this.page.locator(ProductPageLocators.addToCartButtons).nth(i).click();
            }
        }
    }

    async filterByNameAtoZ() {
        await this.page.selectOption(ProductPageLocators.filterDropDown, "az");
    }

    async filterByNameZtoA() {
        await this.page.selectOption(ProductPageLocators.filterDropDown, "za");
    }

    async filterBypriceHighToLow() {
        await this.page.selectOption(ProductPageLocators.filterDropDown, "hilo");
    }

    async filterByPriceLowToHigh() {
        await this.page.selectOption(ProductPageLocators.filterDropDown, "lohi");
    }

    async getProductNames() {
        return await this.page.locator(ProductPageLocators.productNames).allTextContents();
    }

    async getProductPrices() {
        const prices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    async clickOnCartLink() {
        await this.page.locator(ProductPageLocators.shoppingCartBadge).click();
    }

    async getFirstProductDetails() {
        const name = await this.page.locator(ProductPageLocators.productNames).first().textContent();
        const description = await this.page.locator(ProductPageLocators.productDescriptions).first().textContent();
        const price = await this.page.locator(ProductPageLocators.productPrices).first().textContent();

        return {
            name: name?.trim(),
            description: description?.trim(),
            price: price?.trim()
        }
    }

    async getAllProductDetails() {
        const allNames = await this.page.locator(ProductPageLocators.productNames).allTextContents();
        const allDescriptions = await this.page.locator(ProductPageLocators.productDescriptions).allTextContents();
        const allPrices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();

        const allProducts = allNames.map((_, i) => ({
            name: allNames[i].trim(),
            description: allDescriptions[i].trim(),
            price: allPrices[i].trim()
        }))
        return allProducts;
    }

    async getSpecificProductDetails(productName: string[]) {
        const allNames = await this.page.locator(ProductPageLocators.productNames).allTextContents();
        const allDescriptions = await this.page.locator(ProductPageLocators.productDescriptions).allTextContents();
        const allPrices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();

        const allProducts = allNames.map((_, i) => ({
            name: allNames[i].trim(),
            description: allDescriptions[i].trim(),
            price: allPrices[i].trim()
        }))

        return allProducts.filter(p => productName.includes(p.name));
    }
}