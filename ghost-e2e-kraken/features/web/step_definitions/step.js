const { Given, When, Then } = require("@cucumber/cucumber");

When(
  "I Login to {kraken-string} with {kraken-string} and {kraken-string}",
  async function (loginUrl, email, password) {
    console.debug({ email, password });
    const result = await this.driver.url(loginUrl);
    const emailElement = await this.driver.$("#identification");
    await emailElement.setValue(email);
    const passwordElement = await this.driver.$("#password");
    await passwordElement.setValue(password);
    const loginButton = await this.driver.$("#ember5");
    await loginButton.click();

    return result;
  }
);
