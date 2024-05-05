import { type Page } from "@playwright/test"
import { AccessType } from "../../domain/AccessType"

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

    const waitResponse = this.page.waitForResponse("**/ghost/api/admin/posts/**")
    // Just to unfocus the Post URL field
    await this.page.getByText("Post settings").click()
    await waitResponse
  }

  async changePostAccess(access: AccessType): Promise<void> {
    await this.settings()

    await this.page.locator("[data-test-select='post-visibility']").selectOption(access)

    await this.page.getByRole("button", { name: "Update" }).click()

    await this.page.getByRole("link", { name: "View Post", exact: true }).waitFor({
      state: "visible",
      timeout: 5000
    })
  }

  async injectHeaderCode(code: string): Promise<void> {
    await this.settings()

    await this.page.getByRole("button", { name: " Code injection" }).click()

    await this.page.locator("div.CodeMirror-code > div:nth-child(1) > pre").first().click()

    await this.page.keyboard.type(code)

    const waitResponse = this.page.waitForResponse("**/ghost/api/admin/posts/**")
    await this.settings()
    await waitResponse
  }

  async unpublish(): Promise<void> {
    await this.page.getByRole("button", { name: "Unpublish" }).click()

    const waitResponse = this.page.waitForResponse("**/ghost/api/admin/posts/**")
    await this.page.getByRole("button", { name: "Unpublish and revert to private draft" }).click()
    await waitResponse
  }

  async getTags(): Promise<string[]> {
    await this.settings()

    const inputLocator = this.page.locator("div#tag-input")

    await inputLocator.waitFor({ state: "visible", timeout: 5000 })

    const tagLocators = await inputLocator.locator("li.tag-token").all()

    return Promise.all(tagLocators.map(locator => locator.innerText()))
  }

  async replaceTags(newTags: string[]): Promise<void> {
    await this.settings()

    const removeButtonLocator = this.page
      .locator("div#tag-input")
      .locator("span.ember-power-select-multiple-remove-btn")
    const numTags = await removeButtonLocator.count()
    for (let i = 0; i < numTags; i++) await removeButtonLocator.first().click()

    const tagsInput = this.page.locator("input.ember-power-select-trigger-multiple-input").first()
    for (const tag of newTags) {
      await tagsInput.fill(tag)
      await tagsInput.press("Enter")
    }

    await this.page.getByRole("button", { name: "Update" }).click()
  }

  async delete(): Promise<void> {
    await this.settings()

    await this.page.getByRole("button", { name: "Delete" }).click()

    // Delete post confirmation
    await this.page.locator("button.gh-btn-red").click()

    await this.page.waitForURL("**/posts")
  }
}
