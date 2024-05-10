import {BASE_URL} from "../constants/url";
import type {Browser} from "webdriverio";
import {ListFilters} from "../utils/list-filters";
import { AbstractPage, ExtendedBrowser } from "./abstract-page";
import { ScreenshotAfterEachStep } from "./decorators";

@ScreenshotAfterEachStep()
export class PageSection extends AbstractPage {
    editPageUrl: string;
    createPageUrl: string;
    oldPageUrl: string;
    publishedPageUrl: string;
    private accessTypeMap = new Map([
        ["Public", "public"],
        ["Members only", "members"],
        ["Paid-members only", "paid"],
        ["Specific tier(s)", "tiers"],
    ]);

    constructor(driver: ExtendedBrowser) {
        super(driver);
        this.editPageUrl = "";
        this.publishedPageUrl = "";
        this.oldPageUrl = "";
        this.createPageUrl = BASE_URL + "/ghost/#/editor/page";
    }

    async navigateToCreatePage() {
        await this.driver.url(this.createPageUrl);
        await this.pause();
    }

    async navigateToEditPage() {
        await this.driver.url(this.editPageUrl);
        await this.pause(2000);
    }

    async setPageTitle(title: string) {
        const titleElement = await this.driver.$(".gh-editor-title");
        await titleElement.waitForDisplayed({timeout: 5000});
        await titleElement.setValue(title);
    }

    async setPageContent(content: string) {
        const contentElement = await this.driver.$(".kg-prose");
        await contentElement.waitForDisplayed({timeout: 5000});
        await contentElement.setValue(content);
        await this.pause(2000);
    }

    async publishPage() {
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

    async setEditPageUrl() {
        this.editPageUrl = await this.driver.getUrl();
    }

    async setPublishedPageUrl() {
        const pageCreated = await this.driver.$(".gh-post-bookmark-wrapper");
        await pageCreated.waitForDisplayed({timeout: 5000});
        this.publishedPageUrl = await pageCreated.getAttribute("href");
    }

    async navigateToPublishedPage() {
        await this.driver.url(this.publishedPageUrl);
        await this.pause();
    }

    async navigateToOldPageUrl() {
        await this.driver.url(this.oldPageUrl);
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

    async clickUnpublishAndRevertToDraft() {
        const revertToDraftButton = await this.driver.$(
            "[data-test-button='revert-to-draft']"
        );
        await revertToDraftButton.waitForDisplayed({timeout: 5000});
        await revertToDraftButton.click();
        await this.pause();
    }

    // some changes to the settings are triggered by moving away from the modified element
    async saveSettingsChange() {
        await this.clickSettingsButton();
        await this.clickSettingsButton();
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

    async selectPageVisibility(accessType: string) {
        const pageVisibilitySelect = await this.driver.$(
            "[data-test-select='post-visibility']"
        );
        await pageVisibilitySelect.waitForDisplayed({timeout: 5000});
        const accessTypeValue = this.accessTypeMap.get(accessType);
        if (!accessTypeValue) throw new Error("Invalid access type");
        await pageVisibilitySelect.selectByAttribute("value", accessTypeValue);
        await this.pause();
    }

    async updatePageUrlSlug(newUrlText: string) {
        const urlElement = await this.driver.$(".post-setting-slug");
        await urlElement.waitForDisplayed({timeout: 5000});
        await urlElement.setValue(newUrlText);
        await this.pause();
    }

    async setNewPageUrl() {
        const urlPreviewUrlElement = await this.driver.$(".ghost-url-preview");
        await urlPreviewUrlElement.waitForDisplayed({timeout: 5000});
        const urlPreviewUrl: string = await urlPreviewUrlElement.getText();
        const newPagePath = urlPreviewUrl.split("/")[1];
        this.oldPageUrl = this.publishedPageUrl;
        this.publishedPageUrl = `${BASE_URL}/${newPagePath}`;
    }

    async clickPublishSaveButton() {
        const saveButton = await this.driver.$("[data-test-button='publish-save']");
        await saveButton.waitForDisplayed({timeout: 5000});
        await saveButton.click();
        await this.pause();
    }

    async getPageTitle() {
        const titleElement = await this.driver.$("h1.gh-article-title");
        await titleElement.waitForDisplayed({timeout: 5000});
        return titleElement.getText();
    }

    async getPageContent() {
        const contentElement = await this.driver.$("section.gh-content > p");
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

    async navigateToPagesList(filter?: ListFilters) {
        const query = new URLSearchParams(filter).toString();
        const url = query
            ? `${BASE_URL}/ghost/#/pages?${query}`
            : `${BASE_URL}/ghost/#/pages`;
        await this.driver.url(url);
        await this.pause();
    }

    async getPageTitles() {
        const pageList = await this.driver.$("div.posts-list.gh-list");
        await pageList.waitForDisplayed({timeout: 5000});
        const titleElements = await this.driver.$$("div.posts-list.gh-list > div > li > a > h3");
        await titleElements[0].waitForDisplayed({timeout: 5000});
        return Promise.all(titleElements.map((element) => element.getText()));
    }

    async clickDeletePage() {
        const deletePageButton = await this.driver.$(
            ".settings-menu-delete-button > button"
        );
        await deletePageButton.waitForDisplayed({timeout: 5000});
        await deletePageButton.click();
        await this.pause();
    }

    async clickDeletePageConfirm() {
        const confirmButton = await this.driver.$(
            "div.modal-footer >button.gh-btn-red"
        );
        await confirmButton.waitForDisplayed({timeout: 5000});
        await confirmButton.click();
        await this.pause();
    }
}
