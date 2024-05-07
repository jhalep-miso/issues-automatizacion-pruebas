import { BASE_URL } from "../constants/url";
import { screenshot } from "./decorator";
import { AbstractPage, ExtendedBrowser } from "./abstract-page";

export class LoginPage extends AbstractPage {
  url: string;
  constructor(driver: ExtendedBrowser) {
    super(driver);
    this.url = BASE_URL + "/ghost/#/signin";
  }

  @screenshot()
  async navigateToLogin() {
    await this.driver.url(this.url);
  }

  @screenshot()
  async enterEmail(email: string) {
    const emailInput = await this.driver.$("#identification");
    await emailInput.waitForDisplayed({ timeout: 5000 });
    await emailInput.setValue(email);
  }

  @screenshot()
  async enterPassword(password: string) {
    const passwordInput = await this.driver.$("#password");
    await passwordInput.waitForDisplayed({ timeout: 5000 });
    await passwordInput.setValue(password);
  }

  @screenshot()
  async clickSignInButton() {
    const signInButton = await this.driver.$("[data-test-button='sign-in']");
    await signInButton.waitForDisplayed({ timeout: 5000 });
    await signInButton.click();
  }
}
