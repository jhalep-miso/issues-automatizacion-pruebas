import { type Page } from "@playwright/test"
import { Config } from "../../Config"
import { NewBlogPagePage } from "./NewBlogPagePage"
import { EditBlogPagePage } from "./EditBlogPagePage"

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

  async editPage(title: string): Promise<EditBlogPagePage> {
    await this.getBlogPageByTitle(title).click()

    return new EditBlogPagePage(this.page)
  }

  async go(): Promise<BlogPagesPage> {
    await this.page.goto(`${Config.baseUri}/${BlogPagesPage.path}`)
    // Wait for the list of blog pages to load
    await this.page.locator("div.posts-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return this
  }
}
