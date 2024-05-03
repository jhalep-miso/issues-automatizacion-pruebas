import { type Page } from "@playwright/test"
import { Tag } from "../../domain/Tag"

export class NewTagPage {

  constructor(private readonly page: Page) { }

  async create(tag: Tag): Promise<void> {
    await this.page.locator("#tag-name").fill(tag.name)

    await this.page.locator("#tag-slug").fill(tag.slug)

    await this.page.locator("#tag-description").fill(tag.description)

    await this.page.getByRole("button", { name: "Save" }).click()

    // Wait for the delete button to appear after creating the tag to avoid issues with navigation
    await this.page.getByRole("button", { name: "Delete" }).isEnabled()
  }
}
