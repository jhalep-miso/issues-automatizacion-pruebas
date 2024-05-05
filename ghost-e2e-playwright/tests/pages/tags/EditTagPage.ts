import { type Page } from "@playwright/test"

export class EditTagPage {

  constructor(private readonly page: Page) { }

  async editName(newName: string): Promise<void> {
    const tagNameLocator = this.page.locator("input#tag-name")

    await tagNameLocator.clear()
    await tagNameLocator.fill(newName)

    await this.page.getByRole("button", { name: "Save", exact: true }).click()
  }

  async delete(): Promise<void> {
    await this.page.getByRole("button", { name: "Delete tag" }).click()

    await this.page.getByRole("button", { name: "Delete", exact: true }).click()

    await this.page.getByRole("heading", { name: "Tags" }).waitFor({
      state: "visible",
      timeout: 5000
    })
  }
}
