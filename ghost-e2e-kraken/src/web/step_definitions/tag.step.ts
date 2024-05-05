import {Given, Then, When} from "@cucumber/cucumber";
import {KrakenWorld} from "../support/support";
import assert from "assert";

Given("I navigate to the tag list", async function (this: KrakenWorld) {
    await this.tagPage.navigateToTagList();
});

Given(
    "I should see a tag with name {kraken-string} mentioning that it has {kraken-string} associated with said tag",
    async function (this: KrakenWorld, tag: string, quantityPostDisplay: string) {
        const postFound = await this.tagPage.validateQuantityPostDisplay(tag, quantityPostDisplay);
        assert.strictEqual(postFound, true);
    });

Given("I create a new tag with label {kraken-string}",
    async function (this: KrakenWorld, tag: string) {
        await this.tagPage.navigateToCreateTag();
        await this.tagPage.setTagName(tag);
        await this.tagPage.clickSaveTag();
    });

When("I click on the \"4 posts\" link from the tag with name {kraken-string}",
    async function (this: KrakenWorld, tag: string) {
        await this.postPage.filterPostByTag(tag);
    });

Then(
    "I should see the 4 Posts that I created initially with their respective titles with tag {kraken-string}",
    async function (this: KrakenWorld, tag: string) {
        const isValidated = await this.tagPage.validateTagCountAndName(tag, 4);
        assert.strictEqual(isValidated, true);
    }
);