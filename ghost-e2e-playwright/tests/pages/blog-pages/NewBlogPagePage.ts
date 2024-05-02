import { type Page } from "@playwright/test"
import { BlogPage } from "../../domain/BlogPage";

export class NewBlogPagePage {

  constructor(private readonly page: Page) { }

  async create(blogPage: BlogPage): Promise<void> {
    await this.page.getByPlaceholder("Page title").fill(blogPage.title)

    await this.page.getByRole("textbox").nth(1).fill(blogPage.content)

    await this.page.getByRole("button", { name: "Publish" }).click()

    await this.page.getByRole("button", { name: "Continue, final review →" }).click()

    await this.page.getByRole("button", { name: "Publish page, right now" }).click()
  }
}
