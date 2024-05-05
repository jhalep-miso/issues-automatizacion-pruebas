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
