import { type Page } from "@playwright/test"

export class EditPostPage {

  constructor(private readonly page: Page) { }

  async delete(): Promise<void> {
    await this.page.getByTitle("Settings").click()

    await this.page.getByRole("button", { name: "Delete" }).click()

    // Delete post confirmation
    await this.page.locator("button.gh-btn-red").click()

    await this.page.waitForURL("**/posts")
  }
}
