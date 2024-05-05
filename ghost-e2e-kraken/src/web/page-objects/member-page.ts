import { BASE_URL } from "./constants";
import type { Browser } from "webdriverio";

export class MemberPage {
  driver: Browser<"async">;
  url = BASE_URL + "/ghost/#/members";
  createNewMemberUrl = BASE_URL + "/ghost/#/members/new";
  createdMemberUrl = "";

  constructor(driver: Browser<"async">) {
    this.driver = driver;
  }

  async pause(milliseconds = 1000) {
    await this.driver.pause(milliseconds);
  }

  async navigateToMembersList() {
    await this.driver.url(this.url);
    await this.pause();
  }

  async navigateToCreateNewMember() {
    await this.driver.url(this.createNewMemberUrl);
    await this.pause();
  }

  async navigateToCreatedMember() {
    await this.driver.url(this.createdMemberUrl);
    await this.pause();
  }

  async setMemberName(name: string) {
    const memberNameElement = await this.driver.$("#member-name");
    await memberNameElement.waitForDisplayed({ timeout: 5000 });
    await memberNameElement.setValue(name);
    await this.pause();
  }

  async setMemberEmail(email: string) {
    const memberEmailElement = await this.driver.$("#member-email");
    await memberEmailElement.waitForDisplayed({ timeout: 5000 });
    await memberEmailElement.setValue(email);
    await this.pause();
  }

  async setMemberLabel(label: string) {
    const memberLabelElement = await this.driver.$("#member-label");
    await memberLabelElement.waitForDisplayed({ timeout: 5000 });
    await memberLabelElement.setValue(label);
    await this.pause();
  }

  async clickSaveMemberButton() {
    const saveButton = await this.driver.$("button[data-test-button='save']");
    await saveButton.waitForDisplayed({ timeout: 5000 });
    await saveButton.click();
    await this.pause();
  }

  async setCreatedMemberUrl() {
    this.createdMemberUrl = await this.driver.getUrl();
  }

  async getMembersListData() {
    const membersList = await this.driver.$$("h3.gh-members-list-name");
    const membersData = [];
    for (const member of membersList) {
      const memberName = await member.getText();
      const classes = await member.getAttribute("class");
      const hasNoNameClass = classes.includes("gh-members-name-noname");
      if (hasNoNameClass) {
        membersData.push({ name: null, email: memberName });
        continue;
      }
      const memberEmailElement = await member.nextElement();
      const memberEmail = await memberEmailElement?.getText();
      membersData.push({ name: memberName, email: memberEmail });
    }
    return membersData;
  }

  async getMemberDetails() {
    const memberMainInfoElement = await this.driver.$(
      "div.gh-member-details-identity > div > h3"
    );

    await memberMainInfoElement.waitForDisplayed({ timeout: 5000 });
    const memberMainInfoText = await memberMainInfoElement.getText();
    const memberAdditionalInfoElement = await this.driver.$(
      "div.gh-member-details-identity > div > p"
    );
    const linkElements = await memberAdditionalInfoElement.$$("a");
    if (linkElements.length > 0) {
      const email = await linkElements[0].getText();
      return { name: memberMainInfoText, email };
    } else {
      return { name: null, email: memberMainInfoText };
    }
  }
}
