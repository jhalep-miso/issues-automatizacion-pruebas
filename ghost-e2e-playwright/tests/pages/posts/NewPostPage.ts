import { type Page } from "@playwright/test"
import { Post } from "../../domain/Post"

export class NewPostPage {

  constructor(private readonly page: Page) { }

  async create(post: Post): Promise<void> {
    await this.page.getByPlaceholder("Post title").fill(post.title)

    await this.page.getByRole("textbox").nth(1).fill(post.content)

    await this.page.getByTitle("Settings").click()

    const tagsInput = this.page.locator("input.ember-power-select-trigger-multiple-input").first()
    for (const tag of post.tags) {
      await tagsInput.fill(tag)
      await tagsInput.press("Enter")
    }

    await this.page.getByRole("button", { name: "Publish" }).click()

    await this.page.getByRole("button", { name: "Continue, final review →" }).click()

    const waitResponse = this.page.waitForResponse("**/ghost/api/admin/posts/**")
    await this.page.getByRole("button", { name: "Publish post, right now" }).click()
    await waitResponse

    // Wait for final page that shows that the post was published successfully to avoid issues with navigation
    await this.page.waitForSelector("img")
  }
}
