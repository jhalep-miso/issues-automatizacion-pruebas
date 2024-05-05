import { type Page } from "@playwright/test"
import { PostAccess } from "../../domain/Post"

export class EditPostPage {

  constructor(private readonly page: Page) { }

  settings(): Promise<void> {
    return this.page.getByTitle("Settings").click()
  }

  async getPublishedUrl(): Promise<string> {
    // For some reason, clicking on the link directly does not work :c
    const url = await this.page.getByRole("link", { name: "Published" }).getAttribute("href")

    return url || ""
  }

  async viewPublished(): Promise<void> {
    const url = await this.getPublishedUrl()

    await this.page.goto(url || "")
  }

  async changeUrlSlug(slug: string): Promise<void> {
    await this.settings()

    await this.page.locator("input#url").fill(slug)

    // Just to unfocus the Post URL field
    await this.page.getByText("Post settings").click()
  }

  async changePostAccess(access: PostAccess): Promise<void> {
    await this.settings()

    await this.page.locator("[data-test-select='post-visibility']").selectOption(access)

    await this.page.getByRole("button", { name: "Update" }).click()

    await this.page.getByRole("link", { name: "View Post", exact: true }).waitFor({
      state: "visible",
      timeout: 5000
    })
  }

  async delete(): Promise<void> {
    await this.settings()

    await this.page.getByRole("button", { name: "Delete" }).click()

    // Delete post confirmation
    await this.page.locator("button.gh-btn-red").click()

    await this.page.waitForURL("**/posts")
  }
}
