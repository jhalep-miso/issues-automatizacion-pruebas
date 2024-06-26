import { BASE_URL } from "../constants/url";
import {ListFilters} from "../utils/list-filters";
import { ScreenshotAfterEachStep } from "./decorators";
import { AbstractPage, ExtendedBrowser } from "./abstract-page";

@ScreenshotAfterEachStep()
export class PostPage extends AbstractPage {
    editPostUrl: string;
    createPostUrl: string;
    filterPostUrlByTag: string;
    oldPostUrl: string;
    publishedPostUrl: string;
    private accessTypeMap = new Map([
        ["Public", "public"],
        ["Members only", "members"],
        ["Paid-members only", "paid"],
        ["Specific tier(s)", "tiers"],
    ]);

    constructor(driver: ExtendedBrowser) {
        super(driver);
        this.editPostUrl = "";
        this.publishedPostUrl = "";
        this.oldPostUrl = "";
        this.createPostUrl = BASE_URL + "/ghost/#/editor/post";
        this.filterPostUrlByTag = BASE_URL + "/ghost/#/posts?tag=";
    }

    async open(url: string) {
        await this.driver.url(url);
        await this.driver.waitUntil(async () => {
            const readyState = await this.driver.execute(() => document.readyState);
            return readyState === 'complete';
        }, {
            timeout: 10000, 
            timeoutMsg: 'expected page to be loaded after 10s'
        });
    }


    async navigateToCreatePost() {
        await this.driver.url(this.createPostUrl);
        await this.pause();
    }

    async navigateToEditPost() {
        await this.driver.url(this.editPostUrl);
        await this.pause(2000);
    }

    async navigateToPostsList(filter?: ListFilters) {
    const query = new URLSearchParams(filter).toString();
    const url = query
      ? `${BASE_URL}/ghost/#/posts?${query}`
      : `${BASE_URL}/ghost/#/posts`;
      await this.open(url);
      await this.pause();
    }

    async setPostTitle(title: string) {
        const titleElement = await this.driver.$(".gh-editor-title");
        await titleElement.waitForDisplayed({timeout: 5000});
        await titleElement.setValue(title);
    }

    async setPostContent(content: string) {
        const contentElement = await this.driver.$(".kg-prose");
        await contentElement.waitForDisplayed({timeout: 5000});
        await contentElement.setValue(content);
        await this.pause(2000);
    }

    async publishPost() {
        const publishButton = await this.driver.$(
            "[data-test-button='publish-flow']"
        );
        await publishButton.waitForDisplayed({timeout: 5000});
        await publishButton.click();
        await this.pause();
        const continueButton = await this.driver.$("[data-test-button='continue']");
        await continueButton.waitForDisplayed({timeout: 5000});
        await continueButton.click();
        await this.pause();
        const confirmButton = await this.driver.$(
            "[data-test-button='confirm-publish']"
        );
        await confirmButton.waitForDisplayed({timeout: 5000});
        await confirmButton.click();
        await this.pause();
    }

    async setEditPostUrl() {
        this.editPostUrl = await this.driver.getUrl();
    }

    async setPublishedPostUrl() {
        const postCreated = await this.driver.$(".gh-post-bookmark-wrapper");
        await postCreated.waitForDisplayed({timeout: 5000});
        this.publishedPostUrl = await postCreated.getAttribute("href");
    }

    async navigateToPublishedPost() {
        await this.driver.url(this.publishedPostUrl);
        await this.pause();
    }

    async navigateToOldPostUrl() {
        await this.driver.url(this.oldPostUrl);
        await this.pause();
    }

    async clickSettingsButton() {
        const settingsButton = await this.driver.$(".settings-menu-toggle");
        await settingsButton.waitForDisplayed({timeout: 5000});
        await settingsButton.click();
        await this.pause();
    }

    async clickUnpublishButton() {
        const unpublishButton = await this.driver.$(
            ".gh-unpublish-trigger[data-test-button='update-flow']"
        );
        await unpublishButton.waitForDisplayed({timeout: 5000});
        await unpublishButton.click();
        await this.pause();
    }

    async clickDeletePost() {
        await this.clickUpdateButton()
        const deletePostButton = await this.driver.$(
            ".settings-menu-delete-button > button"
        );
        await deletePostButton.waitForDisplayed({timeout: 5000});
        await deletePostButton.click();
        await this.pause();
    }

    async clickDeletePostConfirm() {
        const confirmButton = await this.driver.$(
            "div.modal-footer >button.gh-btn-red"
        );
        await confirmButton.waitForDisplayed({timeout: 5000});
        await confirmButton.click();
        await this.pause();
    }

    async clickUnpublishAndRevertToDraft() {
        const revertToDraftButton = await this.driver.$(
            "[data-test-button='revert-to-draft']"
        );
        await revertToDraftButton.waitForDisplayed({timeout: 5000});
        await revertToDraftButton.click();
        await this.pause();
    }

    async clickUpdateButton() {
        const updateButton = await this.driver.$(
        "[data-test-button='publish-save']"
        );
        await updateButton.waitForDisplayed({ timeout: 5000 });
        await updateButton.click();
        await this.pause();
    }

    // some changes to the settings are triggered by moving away from the modified element
    async saveSettingsChange() {
        await this.clickSettingsButton();
        await this.clickSettingsButton();
        await this.clickUpdateButton();
    }

    async clickCodeInjectionButton() {
        const codeInjectionButton = await this.driver.$(
            "[data-test-button='codeinjection']"
        );
        await codeInjectionButton.waitForDisplayed({timeout: 5000});
        await codeInjectionButton.click();
        await this.pause();
    }

    async addCodeInjectionElement(elementType: string, text: string, id: string) {
        const codeInjectionElement = await this.driver.$(
            "div.CodeMirror-code > div:nth-child(1) > pre"
        );
        await codeInjectionElement.waitForDisplayed({timeout: 5000});
        await codeInjectionElement.click();
        await this.driver.keys(
            `<${elementType} id="${id}">${text}</${elementType}>`
        );
        await this.saveSettingsChange();
        await this.pause();
    }

    async selectPostVisibility(accessType: string) {
        const postVisibilitySelect = await this.driver.$(
            "[data-test-select='post-visibility']"
        );
        await postVisibilitySelect.waitForDisplayed({timeout: 5000});
        const accessTypeValue = this.accessTypeMap.get(accessType);
        if (!accessTypeValue) throw new Error("Invalid access type");
        await postVisibilitySelect.selectByAttribute("value", accessTypeValue);
        await this.pause();
    }

    async updatePostUrlSlug(newUrlText: string) {
        const urlElement = await this.driver.$(".post-setting-slug");
        await urlElement.waitForDisplayed({timeout: 5000});
        await urlElement.setValue(newUrlText);
        await this.pause();
    }

    async setNewPostUrl() {
        const urlPreviewUrlElement = await this.driver.$(".ghost-url-preview");
        await urlPreviewUrlElement.waitForDisplayed({timeout: 5000});
        const urlPreviewUrl: string = await urlPreviewUrlElement.getText();
        const newPostPath = urlPreviewUrl.split("/")[1];
        this.oldPostUrl = this.publishedPostUrl;
        this.publishedPostUrl = `${BASE_URL}/${newPostPath}`;
    }

    async clickPublishSaveButton() {
        const saveButton = await this.driver.$("[data-test-button='publish-save']");
        await saveButton.waitForDisplayed({timeout: 5000});
        await saveButton.click();
        await this.pause();
    }

    async getPostTitle() {
        const titleElement = await this.driver.$("h1.gh-article-title");
        await titleElement.waitForDisplayed({timeout: 5000});
        return titleElement.getText();
    }

    async getPostTitles() {
        const postListElement = await this.driver.$("div.posts-list.gh-list");
        await postListElement.waitForDisplayed({timeout: 5000});
        const titleElements = await this.driver.$$("div.posts-list.gh-list > div > li > a > h3");
        return Promise.all(titleElements.map((element) => element.getText()));
    }
    
    async getPostContent() {
        const contentElement = await this.driver.$("section.gh-content");
        await contentElement.waitForDisplayed({timeout: 5000});
        return contentElement.getText();
    }

    async getElement(elementType: string, id: string) {
        try {
            const element = await this.driver.$(`${elementType}#${id}`);
            await element.waitForDisplayed({timeout: 5000});
            return element;
        } catch (error) {
            return null;
        }
    }

    async getSubscriptionBannerText() {
        const bannerTitle = await this.driver.$("h2");
        await bannerTitle.waitForDisplayed({timeout: 5000});
        return bannerTitle.getText();
    }

    async getErrorText(): Promise<string> {
        const errorText = await this.driver.$(".error-description");
        await errorText.waitForDisplayed({timeout: 5000});
        return errorText.getText();
    }

    async getErrorCode(): Promise<number> {
        const errorText = await this.driver.$(".error-code");
        await errorText.waitForDisplayed({timeout: 5000});
        return errorText.getText().then((text: string) => parseInt(text, 10));
    }

    async filterPostByTag(tag: string) {
        await this.driver.url(this.filterPostUrlByTag + tag.toLowerCase());
        await this.pause();
    }
}
