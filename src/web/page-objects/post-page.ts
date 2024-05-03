const BASE_URL = "https://ghost-ebcl.onrender.com";
import type { Browser } from "webdriverio";

export class PostPage {
  driver: Browser<"async">;
  editPostUrl: string;
  createPostUrl: string;
  private accessTypeMap = new Map([
    ["Public", "public"],
    ["Members only", "members"],
    ["Paid-members only", "paid"],
    ["Specific tier(s)", "tiers"],
  ]);
  publishedPostUrl: string;

  constructor(driver: Browser<"async">) {
    this.driver = driver;
    this.editPostUrl = "";
    this.publishedPostUrl = "";
    this.createPostUrl = BASE_URL + "/ghost/#/editor/post";
  }

  async pause(milliseconds = 1000) {
    await this.driver.pause(milliseconds);
  }

  async navigateToCreatePost() {
    await this.driver.url(this.createPostUrl);
    await this.pause();
  }

  async navigateToEditPost() {
    await this.driver.url(this.editPostUrl);
    await this.pause(2000);
  }

  async setPostTitle(title: string) {
    const titleElement = await this.driver.$(".gh-editor-title");
    await titleElement.waitForDisplayed({ timeout: 5000 });
    await titleElement.setValue(title);
  }

  async setPostContent(content: string) {
    const contentElement = await this.driver.$(".kg-prose");
    await contentElement.waitForDisplayed({ timeout: 5000 });
    await contentElement.setValue(content);
    await this.pause(2000);
  }

  async publishPost() {
    const publishButton = await this.driver.$(
      "[data-test-button='publish-flow']"
    );
    await publishButton.waitForDisplayed({ timeout: 5000 });
    await publishButton.click();
    await this.pause();
    const continueButton = await this.driver.$("[data-test-button='continue']");
    await continueButton.waitForDisplayed({ timeout: 5000 });
    await continueButton.click();
    await this.pause();
    const confirmButton = await this.driver.$(
      "[data-test-button='confirm-publish']"
    );
    await confirmButton.waitForDisplayed({ timeout: 5000 });
    await confirmButton.click();
    await this.pause();
  }

  async setEditPostUrl() {
    this.editPostUrl = await this.driver.getUrl();
  }

  async setPublishedPostUrl() {
    const postCreated = await this.driver.$(".gh-post-bookmark-wrapper");
    await postCreated.waitForDisplayed({ timeout: 5000 });
    this.publishedPostUrl = await postCreated.getAttribute("href");
  }

  async navigateToPublishedPost() {
    await this.driver.url(this.publishedPostUrl);
    await this.pause();
  }

  async clickSettingsButton() {
    const settingsButton = await this.driver.$(".settings-menu-toggle");
    await settingsButton.waitForDisplayed({ timeout: 5000 });
    await settingsButton.click();
    await this.pause();
  }

  async selectPostVisibility(accessType: string) {
    const postVisibilitySelect = await this.driver.$(
      "[data-test-select='post-visibility']"
    );
    await postVisibilitySelect.waitForDisplayed({ timeout: 5000 });
    const accessTypeValue = this.accessTypeMap.get(accessType);
    if (!accessTypeValue) throw new Error("Invalid access type");
    await postVisibilitySelect.selectByAttribute("value", accessTypeValue);
    await this.pause();
  }

  async clickPublishSaveButton() {
    const saveButton = await this.driver.$("[data-test-button='publish-save']");
    await saveButton.waitForDisplayed({ timeout: 5000 });
    await saveButton.click();
    await this.pause();
  }

  async getPostTitle() {
    const titleElement = await this.driver.$("h1");
    await titleElement.waitForDisplayed({ timeout: 5000 });
    return titleElement.getText();
  }

  async getSubscriptionBannerText() {
    const bannerTitle = await this.driver.$("h2");
    await bannerTitle.waitForDisplayed({ timeout: 5000 });
    return bannerTitle.getText();
  }
}
