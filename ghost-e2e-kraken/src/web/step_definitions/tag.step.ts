import {Given, Then, When} from "@cucumber/cucumber";
import {KrakenWorld} from "../support/support";
import assert from "assert";

Given("I navigate to the tag list", async function (this: KrakenWorld) {
    await this.tagPage.navigateToTagList();
});

Given(
    "I should see a tag with name {generated-string} mentioning that it has {generated-string} associated with said tag",
    async function (this: KrakenWorld, tag: string, quantityPostDisplay: string) {
        const postFound = await this.tagPage.validateQuantityPostDisplay(tag, quantityPostDisplay);
        assert.strictEqual(postFound, true);
    });

Given("I create a new tag with label {generated-string}",
    async function (this: KrakenWorld, tag: string) {
        await this.tagPage.navigateToCreateTag();
        await this.tagPage.setTagName(tag);
        await this.tagPage.clickSaveTag();
    });

Given("I delete the tag with name {generated-string}",
    async function (this: KrakenWorld, tag: string) {
        await this.tagPage.navigateToEditTag(tag);
        await this.tagPage.clickDeleteTag();
        await this.tagPage.clickButtonConfirm();
    });

Given("I edit the tag's name {generated-string} with another one {generated-string}",
    async function (this: KrakenWorld, previousTag: string, tag: string) {
        await this.tagPage.navigateToEditTag(previousTag);
        await this.tagPage.setTagName(tag);
        await this.tagPage.clickSaveTag();
    });


When("I click on the {generated-string} link from the tag with name {generated-string}",
    async function (this: KrakenWorld, quantity: string, tag: string) {
        await this.postPage.filterPostByTag(tag);
    });

Then(
    "I should see the 4 Posts that I created initially with their respective titles with tag {generated-string}",
    async function (this: KrakenWorld, tag: string) {
        const isValidated = await this.tagPage.validateTagCountAndName(tag, 4);
        assert.ok(isValidated);
    }
);

Then(
    "I should see the Post that I created initially with their respective titles with tag {generated-string}",
    async function (this: KrakenWorld, tag: string) {
        const isValid = await this.tagPage.validateTagCountAndName(tag, 1);
        assert.ok(isValid);
    }
);

Then("I should see that the post has no tags",
    async function (this: KrakenWorld) {
        const hasTags = await this.tagPage.hasTags();
        assert.ok(!hasTags);
    }
);

Then("Then I should see a that the post has a tag with name {generated-string}",
    async function (this: KrakenWorld, tag: string) {
        const hasNewTag = await this.tagPage.hasTag(tag);
        assert.ok(hasNewTag);
    }
);