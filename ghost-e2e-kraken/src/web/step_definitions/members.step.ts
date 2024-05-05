import { Given, When, Then } from "@cucumber/cucumber";
import { KrakenWorld } from "../support/support";
import assert from "assert";

Given("I navigate to the members list", async function (this: KrakenWorld) {
  await this.memberPage.navigateToMembersList();
});

When(
  "I create a new member with name {kraken-string} and email {kraken-string}",
  async function (this: KrakenWorld, name: string, email: string) {
    await this.memberPage.navigateToMembersList();
    await this.memberPage.navigateToCreateNewMember();
    await this.memberPage.setMemberName(name);
    await this.memberPage.setMemberEmail(email);
    await this.memberPage.clickSaveMemberButton();
    await this.memberPage.setCreatedMemberUrl();
  }
);

Given("I get the Impersonate link", async function (this: KrakenWorld) {
  await this.memberPage.clickMemberSettingsButton();
  await this.memberPage.clickImpersonateButton();
});

When("I copy link", async function (this: KrakenWorld) {
  const impersonateLink = await this.memberPage.copyImpersonateLink();
  this.memberPage.setImpersonateLink(impersonateLink);
  await this.memberPage.clickCloseImpersonateDialogButton();
});

When(
  "I navigate to the Impersonate link in another tab",
  async function (this: KrakenWorld) {
    await this.memberPage.navigateToImpersonateLink();
  }
);

When(
  "I edit member with name {kraken-string} from Impersonate link",
  async function (this: KrakenWorld, name: string) {
    await this.memberPage.clickMemberAccountButton();
    await this.memberPage.editMemberNameInFrame(name);
  }
);

When(
  "I return and refresh the members list in the administration panel",
  async function (this: KrakenWorld) {
    await this.memberPage.navigateToMembersList();
  }
);

When("I select delete member option", async function (this: KrakenWorld) {
  await this.memberPage.clickMemberSettingsButton();
  await this.memberPage.clickDeleteMemberButton();
});

When("I confirm delete member", async function (this: KrakenWorld) {
  await this.memberPage.clickConfirmDeleteMemberButton();
});

Then(
  "I should see a message error which say Could not sign in. Login link expired",
  async function (this: KrakenWorld) {
    const errorMessage = await this.memberPage.getImpersonateErrorMessage();
    assert.match(errorMessage, /Could not sign in. Login link expired/);
  }
);

Then(
  "I should see the member with name {kraken-string} and email {kraken-string}",
  async function (this: KrakenWorld, name: string, email: string) {
    const membersList = await this.memberPage.getMembersListData();
    const member = membersList.find(
      (m) => m.name === name && m.email === email
    );

    assert(member?.name === name);
    assert(member?.email === email);
  }
);

When("I navigate to the created member", async function (this: KrakenWorld) {
  await this.memberPage.navigateToCreatedMember();
});

Then(
  "I should see the {kraken-string} and {kraken-string} of the created member.",
  async function (this: KrakenWorld, name: string, email: string) {
    const memberDetails = await this.memberPage.getMemberDetails();
    assert(memberDetails?.name === name);
    assert(memberDetails.email === email);
  }
);
