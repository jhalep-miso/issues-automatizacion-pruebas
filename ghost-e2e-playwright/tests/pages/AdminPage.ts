import { type Page } from "@playwright/test"
import { TagsPage } from "./tags/TagsPage"
import { PostPage } from "./posts/PostsPage"
import { BlogPagesPage } from "./blog-pages/BlogPagesPage"
import { MembersPage } from "./members/MembersPage"
import { Config } from "../Config"

export class AdminPage {

  private static readonly path = "ghost"

  constructor(private readonly page: Page) { }

  async pages(): Promise<BlogPagesPage> {
    await this.page.getByRole("link", { name: "Pages", exact: true }).click()

    return new BlogPagesPage(this.page)
  }

  async posts(): Promise<PostPage> {
    await this.page.getByRole("link", { name: "Posts", exact: true }).click()

    return new PostPage(this.page)
  }

  async tags(): Promise<TagsPage> {
    await this.page.getByRole("link", { name: "Tags", exact: true }).click()

    return new TagsPage(this.page)
  }

  async members(): Promise<MembersPage> {
    // await this.page.getByRole("link", { name: "Members", exact: true }).click() // This one does not work
    await this.page.goto(`${Config.baseUri}/${MembersPage.path}`)
    await this.page.getByRole("heading", { name: "Get started with memberships" }).waitFor({
      state: "visible",
      timeout: 50000
    })

    return new MembersPage(this.page)
  }

  async go(): Promise<AdminPage> {
    await this.page.goto(`${Config.baseUri}/${AdminPage.path}`)

    return this
  }
}
