import { AbstractPage, ExtendedBrowser } from "./abstract-page";
import { ScreenshotAfterEachStep } from "./decorators";

@ScreenshotAfterEachStep()
export class ErrorPage extends AbstractPage {
    constructor(driver: ExtendedBrowser) {
        super(driver);
    }

    async getErrorText(): Promise<string> {
        const errorText = await this.driver.$(".error-description");
        await errorText.waitForDisplayed({timeout: 5000});
        return errorText.getText();
    }

    async getErrorCode(): Promise<number> {
        const errorText = await this.driver.$(".error-code");
        await errorText.waitForDisplayed({timeout: 5000});
        return errorText.getText().then((text: string) => parseInt(text, 10));
    }
}
