import { Page } from "@playwright/test";
import { CheckoutOverviewLocators } from "../locators/CheckoutOverviewLocators";

export class CheckoutOverviewPage {

    constructor(private page: Page) {

    }

    async getCheckoutOverviewElements() {
        return {
            pageInfo: this.page.locator(CheckoutOverviewLocators.pageInfo),
            cancelButton: this.page.locator(CheckoutOverviewLocators.cancelButton),
            finishButton: this.page.locator(CheckoutOverviewLocators.finishButton)
        }
    }

    async getOverviewProducts() {
        const allNames = await this.page.locator(CheckoutOverviewLocators.productNames).allTextContents();
        const allDescriptions = await this.page.locator(CheckoutOverviewLocators.productDescriptions).allTextContents();
        const allPrices = await this.page.locator(CheckoutOverviewLocators.productPrices).allTextContents();

        const allCheckoutOverviewProducts = allNames.map((_, i) => ({
            name: allNames[i].trim(),
            description: allDescriptions[i].trim(),
            price: allPrices[i].trim()
        }))
        return allCheckoutOverviewProducts;
    }

    async getItemTotal(){
        const text = await this.page.locator(CheckoutOverviewLocators.itemTotal).textContent();
        return parseFloat(text!.replace("Item total: $", ""));
    }

    async getTax(){
        const text = await this.page.locator(CheckoutOverviewLocators.tax).textContent();
        return parseFloat(text!.replace("Tax: $", ""));
    }

    async getTotal(){
        const text = await this.page.locator(CheckoutOverviewLocators.total).textContent();
        return parseFloat(text!.replace("Total: $", ""));
    }

    async clickCancelButton(){
        this.page.locator(CheckoutOverviewLocators.cancelButton).click()
    }

    async clickFinishButton(){
        this.page.locator(CheckoutOverviewLocators.finishButton).click()
    }
}