const { Given } = require("@cucumber/cucumber");
const LoginPage = require("../page-objects/login-page");

Given(
  "I Login with {kraken-string} and {kraken-string}",
  async function (this: any, email: string, password: string) {
    const loginPage = new LoginPage(this.driver);
    await loginPage.navigateToLogin();
    await loginPage.enterEmail(email);
    await loginPage.enterPassword(password);
    await loginPage.clickSignInButton();
  }
);
