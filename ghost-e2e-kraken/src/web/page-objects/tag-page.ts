import type {Browser} from "webdriverio";
import {BASE_URL} from "./constants";

export class TagPage {
    driver: Browser<"async">;
    listTagUrl: string;
    createTagUrl: string;

    constructor(driver: Browser<"async">) {
        this.driver = driver;
        this.listTagUrl = BASE_URL + "/ghost/#/tags";
        this.createTagUrl = BASE_URL + "/ghost/#/tags/new";
    }

    async pause(milliseconds = 1000) {
        await this.driver.pause(milliseconds);
    }

    async navigateToTagList() {
        await this.driver.url(this.listTagUrl);
        await this.pause();
    }

    //ember-power-select-trigger-multiple-input-ember2261
    async addPostTag(tag: string) {
        const tagInputElement = await this.driver.$('.ember-power-select-trigger-multiple-input');
        await tagInputElement.setValue(tag);
        await tagInputElement.execute(() => {
            const event = new Event('change', {bubbles: true});
            const element = document.querySelector('.ember-power-select-trigger-multiple-input');
            if (element) {
                element.dispatchEvent(event);
            }
        });
        await this.pause(500);
        const saveButton = await this.driver.$("[data-option-index='0']");
        await saveButton.click();
        await this.driver.$('body').click();

    }

    async validateQuantityPostDisplay(tag: string, quantityPostDisplay: string) {
        const tagListItems = await this.driver.$$('.gh-tags-list-item');
        let found = false;
        for (const listItem of tagListItems) {
            const tagNameElement = await listItem.$('.gh-tag-list-name');
            const tagName = await tagNameElement.getText();
            console.log(tag)
            if (tagName.trim() === tag) {
                const postCountElement = await listItem.$('.gh-tag-list-posts-count');
                const postCountText = await postCountElement.getText();
                console.log(postCountText + "-" + quantityPostDisplay)
                if (postCountText.trim() === quantityPostDisplay.trim()) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }

    async validateTagCountAndName(tag: string, quantityPost: number) {
        const tagListItems = await this.driver.$$('.gh-posts-list-item');
        let count = 0;
        for (const listItem of tagListItems) {
            const tagNameElement = await listItem.$('.midgrey-l2');
            const tagName = await tagNameElement.getText();
            console.log(tagName+"-"+tag)
            if (tagName.trim() === tag) {
                count++;
            } else {
                return false;
            }
        }
        console.log(count+"-"+quantityPost)
        return count === quantityPost;

    }

    async navigateToCreateTag() {
        await this.driver.url(this.createTagUrl);
        await this.pause();
    }

    async setTagName(tag: string) {
        const nameElement = await this.driver.$("[data-test-input='tag-name']");
        await nameElement.waitForDisplayed({timeout: 5000});
        await nameElement.setValue(tag);
    }

    async clickSaveTag() {
        const saveButton = await this.driver.$("[data-test-button='save']");
        await saveButton.waitForDisplayed({timeout: 5000});
        await saveButton.click();
        await this.pause();
    }
}
