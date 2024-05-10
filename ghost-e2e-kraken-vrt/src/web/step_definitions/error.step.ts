import {Then} from "@cucumber/cucumber";
import {KrakenWorld} from "../support/support";
import assert from "assert";

Then(
    "I should see a {string} error and an error code {int}",
    async function (
        this: KrakenWorld,
        errorDescription: string,
        errorCode: number
    ) {
        const errorText = await this.postPage.getErrorText();
        assert.strictEqual(errorText, errorDescription);

        const statusCode = await this.postPage.getErrorCode();
        assert.strictEqual(statusCode, errorCode);
    }
);