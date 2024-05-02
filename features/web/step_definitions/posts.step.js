const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const PostPage = require("../page-objects/post-page");

Given(
  "I create a new post with title {kraken-string} and content {kraken-string}",
  async function (title, content) {
    this.postPage = new PostPage(this.driver);
    await this.postPage.navigateToCreatePost();
    await this.postPage.setPostTitle(title);
    await this.postPage.setPostContent(content);
    await this.postPage.publishPost();
    await this.postPage.setEditPostUrl();
    await this.postPage.setPublishedPostUrl();
  }
);

Given("I navigate to the created post", async function () {
  await this.postPage.navigateToPublishedPost();
});

When(
  "I update the created post access to {string}",
  async function (accessType) {
    await this.postPage.navigateToEditPost();
    await this.postPage.clickSettingsButton();
    await this.postPage.selectPostVisibility(accessType);
    await this.postPage.clickPublishSaveButton();
  }
);

Then(
  "I should see the post title {kraken-string} and a banner with text {string}",
  async function (title, text) {
    const titleText = await this.postPage.getPostTitle();
    assert.strictEqual(titleText, title);

    const bannerText = await this.postPage.getSubscriptionBannerText();
    assert.strictEqual(bannerText, text);
  }
);
