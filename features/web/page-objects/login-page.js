const { BASE_URL } = require("../../../properties.json");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = BASE_URL + "/ghost/#/signin";
  }

  async pause(milliseconds = 1000) {
    await this.driver.pause(milliseconds);
  }

  async navigateToLogin() {
    await this.driver.url(this.url);
    await this.pause();
  }

  async enterEmail(email) {
    const emailInput = await this.driver.$("#identification");
    await emailInput.waitForDisplayed({ timeout: 5000 });
    await emailInput.setValue(email);
  }

  async enterPassword(password) {
    const passwordInput = await this.driver.$("#password");
    await passwordInput.waitForDisplayed({ timeout: 5000 });
    await passwordInput.setValue(password);
  }

  async clickSignInButton() {
    const signInButton = await this.driver.$("[data-test-button='sign-in']");
    await signInButton.waitForDisplayed({ timeout: 5000 });
    await signInButton.click();
    await this.pause();
  }
}

module.exports = LoginPage;
