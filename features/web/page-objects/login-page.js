const { BASE_URL } = require("../../../properties.json");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = BASE_URL + "/ghost/#/signin";
  }

  async navigateToLogin() {
    await this.driver.url(this.url);
  }

  async enterEmail(email) {
    const emailInput = await this.driver.$("#identification");
    await emailInput.setValue(email);
  }

  async enterPassword(password) {
    const passwordInput = await this.driver.$("#password");
    await passwordInput.setValue(password);
  }

  async clickSignInButton() {
    const signInButton = await this.driver.$("[data-test-button='sign-in']");
    await signInButton.click();
  }
}

module.exports = LoginPage;
