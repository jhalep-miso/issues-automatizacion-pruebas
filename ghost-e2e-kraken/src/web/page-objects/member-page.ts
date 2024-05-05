import { BASE_URL } from "./constants";
import type { Browser } from "webdriverio";

export class MemberPage {
  driver: Browser<"async">;
  url = BASE_URL + "/ghost/#/members";
  createNewMemberUrl = BASE_URL + "/ghost/#/members/new";
  createdMemberUrl = "";
  impersonateLink = "";

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

  async navigateToImpersonateLink() {
    await this.driver.url(this.impersonateLink);
    await this.pause(5000);
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

  async setImpersonateLink(link: string) {
    this.impersonateLink = link;
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

  async clickMemberSettingsButton() {
    const memberSettingsButton = await this.driver.$(
      "button[data-test-button='member-actions']"
    );
    await memberSettingsButton.waitForDisplayed({ timeout: 5000 });
    await memberSettingsButton.click();
    await this.pause();
  }

  async clickImpersonateButton() {
    const impersonateButton = await this.driver.$(
      "button[data-test-button='impersonate']"
    );
    await impersonateButton.waitForDisplayed({ timeout: 5000 });
    await impersonateButton.click();
    await this.pause();
  }

  async copyImpersonateLink() {
    const impersonateCopyLinkElement = await this.driver.$(
      "input[data-test-input='member-signin-url']"
    );
    await impersonateCopyLinkElement.waitForDisplayed({ timeout: 5000 });
    const link = await impersonateCopyLinkElement.getValue();
    return link;
  }

  async clickMemberAccountButton() {
    const memberAccountButton = await this.driver.$("a[data-portal='account']");
    await memberAccountButton.waitForDisplayed({ timeout: 15000 });
    await memberAccountButton.click();
    await this.pause();
  }

  async editMemberNameInFrame(name: string) {
    const popupFrameElement = await this.driver.$(
      "[data-testid='portal-popup-frame']"
    );
    await popupFrameElement.waitForDisplayed({ timeout: 5000 });
    await this.driver.switchToFrame(popupFrameElement);
    const editMemberButton = await this.driver.$(
      "[data-test-button='edit-profile']"
    );
    await editMemberButton.waitForDisplayed({ timeout: 5000 });
    await editMemberButton.click();
    await this.setMemberEditNameInFrame(name);
    await this.clickSaveAccountMemberButtonInFrame();
    await this.driver.switchToParentFrame();
    await this.pause();
  }

  private async setMemberEditNameInFrame(name: string) {
    const memberEditNameElement = await this.driver.$(
      "[data-test-input='input-name']"
    );
    await memberEditNameElement.waitForDisplayed({ timeout: 5000 });
    await memberEditNameElement.setValue(name);
    await this.pause();
  }

  private async clickSaveAccountMemberButtonInFrame() {
    const saveMemberButton = await this.driver.$(
      "button[data-test-button='save-button']"
    );
    await saveMemberButton.waitForDisplayed({ timeout: 5000 });
    await saveMemberButton.click();
    await this.pause();
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
