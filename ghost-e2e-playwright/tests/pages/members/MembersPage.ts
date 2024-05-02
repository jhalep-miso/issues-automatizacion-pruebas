import { type Page } from "@playwright/test"
import { Config } from "../../Config"
import { NewMemberPage } from "./NewMemberPage"

export class MembersPage {

  private static readonly path = "ghost/#/members"

  constructor(private readonly page: Page) { }

  getMemberByEmail(email: string) {
    return this.page.getByText(email)
  }

  async newMember(): Promise<NewMemberPage> {
    await this.page.getByRole("link", { name: "New member", exact: true }).click()

    return new NewMemberPage(this.page)
  }

  async go(): Promise<MembersPage> {
    await this.page.goto(`${Config.baseUri}/${MembersPage.path}`)

    return this
  }
}
