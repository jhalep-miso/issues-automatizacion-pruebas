import { type Page } from "@playwright/test"

export class EditTagPage {

  constructor(private readonly page: Page) { }

  async editName(newName: string): Promise<void> {
    const tagNameLocator = this.page.locator("input#tag-name")

    // Delete existing name
    await tagNameLocator.fill("")
    // Fill with new name
    await tagNameLocator.fill(newName)

    await this.page.getByRole("button", { name: "Save", exact: true }).click()
  }
}
