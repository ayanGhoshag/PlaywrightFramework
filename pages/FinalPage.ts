import { Page } from "@playwright/test";
import { FinalPageLocators } from "../locators/FinalPageLocators";

export class FinalPage {

    constructor(private page : Page){

    }

    async getFinalpageElements(){
        return{
            pageInfo : this.page.locator(FinalPageLocators.pageInfo),
            successMsg : this.page.locator(FinalPageLocators.successMessage),
            backHomeButton : this.page.locator(FinalPageLocators.backHomeButton),
        }
    }

    async getSuccessMsgText(){
        const text = this.page.locator(FinalPageLocators.successMessage).innerText();
        return (await text).trim();
    }

    async clickOnBackHomeButton(){
        await this.page.locator(FinalPageLocators.backHomeButton).click();
    }
}