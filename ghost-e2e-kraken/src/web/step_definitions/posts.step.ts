import { KrakenWorld } from "../support/support";

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

Given(
    "I create a new post with title {kraken-string}, content {kraken-string} and tag {kraken-string}",
    async function (this: KrakenWorld, title: string, content: string, tag: string) {
        await this.postPage.navigateToCreatePost();
        await this.postPage.setPostTitle(title);
        await this.postPage.setPostContent(content);
        await this.postPage.clickSettingsButton();
        await this.tagPage.addPostTag(tag);
        await this.postPage.clickSettingsButton();
        await this.postPage.publishPost();
        await this.postPage.setEditPostUrl();
        await this.postPage.setPublishedPostUrl();
    }
);

Given("I edit the previously created post, replacing the tag {kraken-string} by a new tag {kraken-string}",
    async function (this: KrakenWorld, previousTag: string, newTag: string) {
        await this.postPage.navigateToEditPost();
        await this.postPage.clickSettingsButton();
        await this.postPage.clickPublishSaveButton();
        await this.tagPage.addPostTag(newTag);
        await this.postPage.clickSettingsButton();
        await this.postPage.clickPublishSaveButton();
    });

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

When("I delete the created post", async function (this: KrakenWorld) {
  await this.postPage.navigateToEditPost();
  await this.postPage.clickSettingsButton();
  await this.postPage.clickDeletePost();
  await this.postPage.clickDeletePostConfirm();
});

When("I navigate to the list of posts", async function (this: KrakenWorld) {
  await this.postPage.navigateToPostsList();
});

When(
  "I navigate to the list of posts filtered by {string} {string}",
  async function (this: KrakenWorld, filterType: string, filterValue: string) {
    await this.postPage.navigateToPostsList({ [filterType]: filterValue });
  }
);

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

Then(
  "I {string} see the post with title {kraken-string} in the list of posts",
  async function (
    this: KrakenWorld,
    condition: "should" | "should not",
    title: string
  ) {
    if (!["should", "should not"].includes(condition)) {
      throw new Error("Invalid condition");
    }

    const postTitles = await this.postPage.getPostTitles();
    if (condition === "should") {
      assert.ok(postTitles.includes(title));
    } else {
      assert.ok(!postTitles.includes(title));
    }
  }
);
