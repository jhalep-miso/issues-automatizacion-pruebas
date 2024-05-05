import { expect, type Page } from "@playwright/test"
import { ImpersonatePage } from "./ImpersonatePage"

export class EditMemberPage {

  constructor(private readonly page: Page) { }

  settings(): Promise<void> {
    return this.page.locator("button.gh-btn-icon.icon-only").click()
  }

  async getImpersonateUrl(): Promise<string> {
    await this.settings()

    await this.page.getByRole("button", { name: "Impersonate" }).click()

    await this.page.getByRole("button", { name: "Copy link" }).click()

    const impersonateUrl = await this.page.evaluate(() => navigator.clipboard.readText())

    await this.page.getByTitle("Close").click()

    return impersonateUrl
  }

  async impersonate(): Promise<ImpersonatePage> {
    const impersonateUrl = await this.getImpersonateUrl()

    await this.page.goto(impersonateUrl)

    return new ImpersonatePage(this.page)
  }

  async delete(): Promise<void> {
    await this.settings()

    await this.page.getByRole("button", { name: "Delete member" }).click()

    // Delete member confirmation
    await this.page.locator("button.gh-btn-red").click()

    await this.page.waitForURL("**/members")
  }
}
