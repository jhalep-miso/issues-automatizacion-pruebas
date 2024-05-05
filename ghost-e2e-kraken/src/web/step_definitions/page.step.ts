import {KrakenWorld} from "web/support/support";

import {Given, Then, When} from "@cucumber/cucumber";
import assert from "assert";

Given(
    "I create a new page with title {kraken-string} and content {kraken-string}",
    async function (this: KrakenWorld, title: string, content: string) {
        await this.pageSection.navigateToCreatePage();
        await this.pageSection.setPageTitle(title);
        await this.pageSection.setPageContent(content);
        await this.pageSection.publishPage();
        await this.pageSection.setEditPageUrl();
        await this.pageSection.setPublishedPageUrl();
    }
);

Given("I navigate to the created page", async function (this: KrakenWorld) {
    await this.pageSection.navigateToPublishedPage();
});

When(
    "I update the created page access to {string}",
    async function (this: KrakenWorld, accessType: string) {
        await this.pageSection.navigateToEditPage();
        await this.pageSection.clickSettingsButton();
        await this.pageSection.selectPageVisibility(accessType);
        await this.pageSection.clickPublishSaveButton();
    }
);

When(
    "I update the page url to the slug of {kraken-string}",
    async function (this: KrakenWorld, newUrlText: string) {
        await this.pageSection.navigateToEditPage();
        await this.pageSection.clickSettingsButton();
        await this.pageSection.updatePageUrlSlug(newUrlText);
        await this.pageSection.saveSettingsChange();
        await this.pageSection.setNewPageUrl();
    }
);

When(
    "I update the created page code injection with a {string} element with id {kraken-string} and text {kraken-string}",
    async function (
        this: KrakenWorld,
        elementType: string,
        text: string,
        id: string
    ) {
        await this.pageSection.navigateToEditPage();
        await this.pageSection.clickSettingsButton();
        await this.pageSection.clickCodeInjectionButton();
        await this.pageSection.addCodeInjectionElement(elementType, text, id);
    }
);

When("I unpublish the created page", async function (this: KrakenWorld) {
    await this.pageSection.navigateToEditPage();
    await this.pageSection.clickUnpublishButton();
    await this.pageSection.clickUnpublishAndRevertToDraft();
});

Then(
    "I should see the page title {kraken-string} and content {kraken-string}",
    async function (this: KrakenWorld, title: string, content: string) {
        const titleText = await this.pageSection.getPageTitle();
        assert.strictEqual(titleText, title);

        const contentText = await this.pageSection.getPageContent();
        assert.strictEqual(contentText, content);
    }
);

Then(
    "I should see the page title {kraken-string} and a banner with text {string}",
    async function (this: KrakenWorld, title: string, text: string) {
        const titleText = await this.pageSection.getPageTitle();
        assert.strictEqual(titleText, title);

        const bannerText = await this.pageSection.getSubscriptionBannerText();
        assert.strictEqual(bannerText, text);
    }
);

Then("I navigate to the old page url", async function (this: KrakenWorld) {
    await this.pageSection.navigateToOldPageUrl();
});

Then(
    "I should see the page with a {string} element with id {kraken-string} and text {kraken-string}",
    async function (
        this: KrakenWorld,
        elementType: string,
        text: string,
        id: string
    ) {
        const element = await this.pageSection.getElement(elementType, id);
        assert.notEqual(element, null);

        const elementText = await element.getText();
        assert.strictEqual(elementText, text);
    }
);

Then(
    "I {string} see the page with title {kraken-string} in the list of pages",
    async function (
        this: KrakenWorld,
        condition: "should" | "should not",
        title: string
    ) {
        if (!["should", "should not"].includes(condition)) {
            throw new Error("Invalid condition");
        }

        const pageTitles = await this.pageSection.getPageTitles();
        if (condition === "should") {
            assert.ok(pageTitles.includes(title));
        } else {
            assert.ok(!pageTitles.includes(title));
        }
    }
);

When(
    "I navigate to the list of pages filtered by {string} {string}",
    async function (this: KrakenWorld, filterType: string, filterValue: string) {
        await this.pageSection.navigateToPagesList({ [filterType]: filterValue });
    }
);

When("I delete the created page", async function (this: KrakenWorld) {
    await this.pageSection.navigateToEditPage();
    await this.pageSection.clickSettingsButton();
    await this.pageSection.clickDeletePage();
    await this.pageSection.clickDeletePageConfirm();
});
