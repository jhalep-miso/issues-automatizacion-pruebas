import { type Page } from "@playwright/test"

export class EditMemberPage {

  constructor(private readonly page: Page) { }

  async delete(): Promise<void> {
    await this.page.locator("button.gh-btn-icon.icon-only").click()

    await this.page.getByRole("button", { name: "Delete member" }).click()

    // Delete member confirmation
    await this.page.locator("button.gh-btn-red").click()

    await this.page.waitForURL("**/members")
  }
}
