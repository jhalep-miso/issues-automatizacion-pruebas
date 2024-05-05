import { type Page, type Locator } from "@playwright/test"
import { Config } from "../../Config"
import { NewMemberPage } from "./NewMemberPage"
import { EditMemberPage } from "./EditMemberPage"

export class MembersPage {

  static readonly path = "ghost/#/members"

  constructor(private readonly page: Page) { }

  getMemberByEmail(email: string): Locator {
    return this.page.getByText(email)
  }

  async newMember(): Promise<NewMemberPage> {
    await this.page.getByRole("link", { name: "New member", exact: true }).click()

    return new NewMemberPage(this.page)
  }

  async editMember(email: string): Promise<EditMemberPage> {
    await this.getMemberByEmail(email).click()

    return new EditMemberPage(this.page)
  }

  async deleteAllMembers(): Promise<void> {
    const memberLocator = this.page.locator("p.gh-members-list-email")
    const numMembers = await memberLocator.count()

    for (let i = 0; i < numMembers; i++) {
      await memberLocator.first().click()
      await new EditMemberPage(this.page).delete()
    }
  }

  async go(): Promise<MembersPage> {
    await this.page.goto(`${Config.baseUri}/${MembersPage.path}`)
    // Wait for the list of members to load
    await this.page.locator(".members-list-container-stretch").waitFor({
      state: "visible",
      timeout: 5000
    })

    return this
  }
}
