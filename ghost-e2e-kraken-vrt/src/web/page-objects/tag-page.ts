import {BASE_URL} from "../constants/url";
import {ScreenshotAfterEachStep} from "./decorators";
import {AbstractPage, ExtendedBrowser} from "./abstract-page";

@ScreenshotAfterEachStep()
export class TagPage extends AbstractPage {
    listTagUrl: string;
    editTagUrl: string;
    createTagUrl: string;

    constructor(driver: ExtendedBrowser) {
        super(driver);
        this.listTagUrl = BASE_URL + "/ghost/#/tags/";
        this.editTagUrl = BASE_URL + "/ghost/#/tags/";
        this.createTagUrl = BASE_URL + "/ghost/#/tags/new";
    }

    async navigateToTagList() {
        await this.driver.url(this.listTagUrl);
        await this.pause();
    }

    //ember-power-select-trigger-multiple-input-ember2261
    async addPostTag(tag: string) {
        const tagInputElement = await this.driver.$('.ember-power-select-trigger-multiple-input');
        await tagInputElement.click();
        await tagInputElement.keys(['Control', 'a']);
        await tagInputElement.keys('Backspace');
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
        const tagsList = await this.driver.$('.tags-list.gh-list');
        await tagsList.waitForDisplayed({timeout: 5000});
        const tagListItems = await this.driver.$$('.gh-tags-list-item');
        let found = false;
        for (const listItem of tagListItems) {
            const tagNameElement = await listItem.$('.gh-tag-list-name');
            const tagName = await tagNameElement.getText();
            console.log("TagName:" + tagName + "-" + tag)
            if (tagName.trim() === tag) {
                const postCountElement = await listItem.$('.gh-tag-list-posts-count');
                const postCountText = await postCountElement.getText();
                console.log("postCountText:" + postCountText + "-" + quantityPostDisplay)
                if (postCountText.trim() === quantityPostDisplay.trim()) {
                    found = true;
                }
            }
        }
        return found;
    }

    async validateTagCountAndName(tag: string, quantityPost: number) {
        const selectedItemElement = await this.driver.$('.gh-contentfilter-tag .ember-power-select-selected-item');
        const tagListItems = await this.driver.$$('.gh-posts-list-item');
        await selectedItemElement.waitForDisplayed({timeout: 5000});
        const selectedItemText = await selectedItemElement.getText();
        console.log("Tag:" + tag + "TagValue:" + selectedItemText.trim() + "tagListItems: " + tagListItems.length)
        return tag === selectedItemText.trim() && tagListItems.length == quantityPost

    }

    async navigateToCreateTag() {
        await this.driver.url(this.createTagUrl);
        await this.pause();
    }

    async navigateToEditTag(tag: string) {
        await this.driver.url(this.editTagUrl + tag.toLowerCase());
        await this.pause();
    }

    async setTagName(tag: string) {
        const nameElement = await this.driver.$("#tag-name");
        await nameElement.waitForDisplayed({timeout: 5000});
        await nameElement.setValue(tag);
        await this.pause();
    }

    async clickSaveTag() {
        const saveButton = await this.driver.$('button[data-test-button="save"].gh-btn, .view-actions button.gh-btn-blue');
        await saveButton.waitForDisplayed({timeout: 5000});
        await saveButton.click();
        await this.pause();
    }

    async clickDeleteTag() {
        await this.scrollToEndOfPage();
        const saveButton = await this.driver.$("[data-test-button='delete-tag'], .gh-btn.gh-btn-red.gh-btn-icon.mb15");
        await saveButton.waitForDisplayed({timeout: 15000});
        await saveButton.scrollIntoView();
        await saveButton.click();
        await this.pause();
    }

    async scrollToEndOfPage() {
        await this.driver.executeScript("document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' })",[]);
    }

    async clickButtonConfirm() {
        const confirmButton = await this.driver.$("[data-test-button='confirm'], .gh-btn.gh-btn-red.gh-btn-icon.ember-view");
        await confirmButton.waitForDisplayed({timeout: 5000});
        await confirmButton.click();
        await this.pause();
    }

    async hasTags() {
        const tagListItems = await this.driver.$$('.gh-article-tag');
        return tagListItems.length > 0
    }

    async hasTag(tag: string) {
        console.log("Elemento inicio: " + tag);
        const tagListItems = await this.driver.$$('.gh-article-tag, section.post-full-tags a');

        if (tagListItems.length > 0) {
            for (const element of tagListItems) {
                const text = await element.getText();
                console.log("Elemento: " + text);
                if (text.toLowerCase() === tag.toLowerCase()) {
                    return true;
                }
            }
        }

        return false;
    }
}
