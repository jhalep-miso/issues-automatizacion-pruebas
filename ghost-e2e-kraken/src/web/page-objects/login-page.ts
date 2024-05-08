import { BASE_URL } from "../constants/url";
import { ScreenshotAfterEachStep } from "./decorator";
import { AbstractPage, ExtendedBrowser } from "./abstract-page";

@ScreenshotAfterEachStep()
export class LoginPage extends AbstractPage {
  url: string;
  constructor(driver: ExtendedBrowser) {
    super(driver);
    this.url = BASE_URL + "/ghost/#/signin";
  }

  async navigateToLogin() {
    await this.driver.url(this.url);
  }

  async enterEmail(email: string) {
    const emailInput = await this.driver.$("#identification");
    await emailInput.waitForDisplayed({ timeout: 5000 });
    await emailInput.setValue(email);
  }

  async enterPassword(password: string) {
    const passwordInput = await this.driver.$("#password");
    await passwordInput.waitForDisplayed({ timeout: 5000 });
    await passwordInput.setValue(password);
  }

  async clickSignInButton() {
    const signInButton = await this.driver.$("[data-test-button='sign-in']");
    await signInButton.waitForDisplayed({ timeout: 5000 });
    await signInButton.click();
  }
}
