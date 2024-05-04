import { KrakenWorld } from "web/support/support";

import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";

Given(
  "I create a new post with title {kraken-string} and content {kraken-string}",
  async function (this: KrakenWorld, title: string, content: string) {
    await this.postPage.navigateToCreatePost();
    await this.postPage.setPostTitle(title);
    await this.postPage.setPostContent(content);
    await this.postPage.publishPost();
    await this.postPage.setEditPostUrl();
    await this.postPage.setPublishedPostUrl();
  }
);

Given("I navigate to the created post", async function (this: KrakenWorld) {
  await this.postPage.navigateToPublishedPost();
});

When(
  "I update the created post access to {string}",
  async function (this: KrakenWorld, accessType: string) {
    await this.postPage.navigateToEditPost();
    await this.postPage.clickSettingsButton();
    await this.postPage.selectPostVisibility(accessType);
    await this.postPage.clickPublishSaveButton();
  }
);

When(
  "I update the post url to the slug of {kraken-string}",
  async function (this: KrakenWorld, newUrlText: string) {
    await this.postPage.navigateToEditPost();
    await this.postPage.clickSettingsButton();
    await this.postPage.updatePostUrlSlug(newUrlText);
    await this.postPage.saveSettingsChange();
    await this.postPage.setNewPostUrl();
  }
);

When(
  "I update the created post code injection with a {string} element with id {kraken-string} and text {kraken-string}",
  async function (
    this: KrakenWorld,
    elementType: string,
    text: string,
    id: string
  ) {
    await this.postPage.navigateToEditPost();
    await this.postPage.clickSettingsButton();
    await this.postPage.clickCodeInjectionButton();
    await this.postPage.addCodeInjectionElement(elementType, text, id);
  }
);

When("I unpublish the created post", async function (this: KrakenWorld) {
  await this.postPage.navigateToEditPost();
  await this.postPage.clickUnpublishButton();
  await this.postPage.clickUnpublishAndRevertToDraft();
});

Then(
  "I should see the post title {kraken-string} and content {kraken-string}",
  async function (this: KrakenWorld, title: string, content: string) {
    const titleText = await this.postPage.getPostTitle();
    assert.strictEqual(titleText, title);

    const contentText = await this.postPage.getPostContent();
    assert.strictEqual(contentText, content);
  }
);

Then(
  "I should see the post title {kraken-string} and a banner with text {string}",
  async function (this: KrakenWorld, title: string, text: string) {
    const titleText = await this.postPage.getPostTitle();
    assert.strictEqual(titleText, title);

    const bannerText = await this.postPage.getSubscriptionBannerText();
    assert.strictEqual(bannerText, text);
  }
);

Then("I navigate to the old post url", async function (this: KrakenWorld) {
  await this.postPage.navigateToOldPostUrl();
});

Then(
  "I should see a {string} error and an error code {int}",
  async function (
    this: KrakenWorld,
    errorDescription: string,
    errorCode: number
  ) {
    const errorText = await this.postPage.getErrorText();
    assert.strictEqual(errorText, errorDescription);

    const statusCode = await this.postPage.getErrorCode();
    assert.strictEqual(statusCode, errorCode);
  }
);

Then(
  "I should see the post with a {string} element with id {kraken-string} and text {kraken-string}",
  async function (
    this: KrakenWorld,
    elementType: string,
    text: string,
    id: string
  ) {
    const element = await this.postPage.getElement(elementType, id);
    assert.notEqual(element, null);

    const elementText = await element.getText();
    assert.strictEqual(elementText, text);
  }
);