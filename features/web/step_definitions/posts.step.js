const { Given, When, Then } = require("@cucumber/cucumber");
const { CREATE_POST_URL } = require("../../../properties.json");
const assert = require("assert");

Given(
  "I create a new post with title {kraken-string} and content {kraken-string}",
  async function (title, content) {
    await this.driver.url(CREATE_POST_URL);
    await this.driver.pause(500);
    const titleElement = await this.driver.$(".gh-editor-title");
    await titleElement.setValue(title);
    const contentElement = await this.driver.$(".kg-prose");
    await contentElement.setValue(content);
    await this.driver.pause(500);
    const publishButton = await this.driver.$(
      "[data-test-button='publish-flow']"
    );
    await publishButton.click();
    const continueButton = await this.driver.$("[data-test-button='continue']");
    await continueButton.click();
    const confirmButton = await this.driver.$(
      "[data-test-button='confirm-publish']"
    );
    await confirmButton.click();
    this.editPostUrl = await this.driver.getUrl();
    await this.driver.pause(500);
    this.createdPostUrl = await this.driver
      .$(".gh-post-bookmark-wrapper")
      .getAttribute("href");
  }
);

Given("I navigate to the created post", async function () {
  await this.driver.url(this.createdPostUrl);
});

const accessTypeMap = new Map([
  ["Public", "public"],
  ["Members Only", "members"],
  ["Paid-Members only", "paid"],
  ["Specific tier(s)", "tiers"],
]);

When(
  "I update the created post access to {string}",
  async function (accessType) {
    await this.driver.url(this.editPostUrl);
    await this.driver.pause(500);
    const settingsButton = await this.driver.$(".settings-menu-toggle");
    await settingsButton.click();
    const postVisibilitySelect = await this.driver.$(
      "[data-test-select='post-visibility']"
    );

    await postVisibilitySelect.selectByAttribute(
      "value",
      accessTypeMap.get(accessType)
    );
    const saveButton = await this.driver.$("[data-test-button='publish-save']");
    await saveButton.click();
  }
);

Then(
  "I should see the post title {kraken-string} and a banner with text {string}",
  async function (title, text) {
    const titleElement = await this.driver.$("h1");
    const titleText = await titleElement.getText();
    assert.strictEqual(titleText, title);

    const bannerTitle = await this.driver.$("h2");
    const bannerText = await bannerTitle.getText();
    assert.strictEqual(bannerText, text);
  }
);
