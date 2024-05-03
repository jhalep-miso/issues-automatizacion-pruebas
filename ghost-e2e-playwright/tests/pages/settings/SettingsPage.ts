import { type Page } from "@playwright/test"
import { Config } from "../../Config"

export class SettingsPage {

  private static readonly path = "ghost/#/settings"

  constructor(private readonly page: Page) { }

  async deleteAllContent(): Promise<void> {
    await this.page.getByRole("button", { name: "Delete all content", exact: true }).click()

    await this.page.getByRole("button", { name: "Delete", exact: true }).click()
  }

  async go(): Promise<SettingsPage> {
    await this.page.goto(`${Config.baseUri}/${SettingsPage.path}`)
    await this.page.getByRole("button", { name: "Delete all content", exact: true }).isEnabled()

    return new SettingsPage(this.page)
  }
}
