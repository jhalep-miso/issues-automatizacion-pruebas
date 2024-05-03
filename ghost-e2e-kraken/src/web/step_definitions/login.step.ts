import { Given } from "@cucumber/cucumber";
import { KrakenWorld } from "../support/support";

Given(
  "I Login with {kraken-string} and {kraken-string}",
  async function (this: KrakenWorld, email: string, password: string) {
    await this.loginPage.navigateToLogin();
    await this.loginPage.enterEmail(email);
    await this.loginPage.enterPassword(password);
    await this.loginPage.clickSignInButton();
  }
);
