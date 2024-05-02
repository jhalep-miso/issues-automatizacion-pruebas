import { type Page } from "@playwright/test"
import { Post } from "../../domain/Post"

export class NewPostPage {

  constructor(private readonly page: Page) { }

  async create(post: Post): Promise<void> {
    await this.page.getByPlaceholder("Post title").fill(post.title)

    await this.page.getByRole("textbox").nth(1).fill(post.content)

    await this.page.getByRole("button", { name: "Publish" }).click()

    await this.page.getByRole("button", { name: "Continue, final review →" }).click()

    await this.page.getByRole("button", { name: "Publish post, right now" }).click()
  }
}
