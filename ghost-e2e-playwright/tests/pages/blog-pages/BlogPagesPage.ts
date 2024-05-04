import { type Page } from "@playwright/test"
import { Config } from "../../Config"
import { NewBlogPagePage } from "./NewBlogPagePage"

export class BlogPagesPage {

  private static readonly path = "ghost/#/pages"

  constructor(private readonly page: Page) { }

  getBlogPageByTitle(title: string) {
    return this.page.getByRole("heading", { name: title })
  }

  async newPage(): Promise<NewBlogPagePage> {
    await this.page.getByRole("link", { name: "New page", exact: true }).click()

    return new NewBlogPagePage(this.page)
  }

  async go(): Promise<BlogPagesPage> {
    await this.page.goto(`${Config.baseUri}/${BlogPagesPage.path}`)
    // Wait for any title to load from the list of blog pages
    await this.page.waitForSelector("h3")

    return this
  }
}