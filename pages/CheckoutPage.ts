import { Page } from "@playwright/test"
import { CheckoutPageLocators } from "../locators/CheckoutPageLocators";

export class CheckoutPage {
    
    constructor (private page : Page){

    }

    async getCheckoutElements(){
        return{
            pageInfo : this.page.locator(CheckoutPageLocators.pageInfo),
            cancel : this.page.locator(CheckoutPageLocators.cancelButton),
            continue : this.page.locator(CheckoutPageLocators.continueButton)
        }
    }

    async fillCheckOutDetails(fistName : string, lastName : string, postalCode : string){
        await this.page.locator(CheckoutPageLocators.firstName).fill(fistName);
        await this.page.locator(CheckoutPageLocators.lastName).fill(lastName);
        await this.page.locator(CheckoutPageLocators.postalCode).fill(postalCode);
    }

    async clickCancel(){
        await this.page.locator(CheckoutPageLocators.cancelButton).click();
    }

    async clickContinue(){
        await this.page.locator(CheckoutPageLocators.continueButton).click();
    }

    async getErrorMessage(){
        return await this.page.locator(CheckoutPageLocators.errorMessage).textContent();
    }
}