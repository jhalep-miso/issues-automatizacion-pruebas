import { type Page } from "@playwright/test"
import { TagsPage } from "./tags/TagsPage"
import { PostPage } from "./posts/PostsPage"
import { BlogPagesPage } from "./blog-pages/BlogPagesPage"
import { MembersPage } from "./members/MembersPage"
import { Config } from "../Config"
import { SettingsPage } from "./settings/SettingsPage"

export class AdminPage {

  private static readonly path = "ghost"

  constructor(private readonly page: Page) { }

  async pages(): Promise<BlogPagesPage> {
    await this.page.getByRole("link", { name: "Pages", exact: true }).click()
    await this.page.locator("div.posts-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return new BlogPagesPage(this.page)
  }

  async posts(): Promise<PostPage> {
    await this.page.getByRole("link", { name: "Posts", exact: true }).click()
    await this.page.locator("div.posts-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return new PostPage(this.page)
  }

  async tags(): Promise<TagsPage> {
    await this.page.getByRole("link", { name: "Tags", exact: true }).click()
    await this.page.locator("ol.tags-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return new TagsPage(this.page)
  }

  async members(): Promise<MembersPage> {
    // await this.page.getByRole("link", { name: "Members", exact: true }).click() // This one does not work
    await this.page.goto(`${Config.baseUri}/${MembersPage.path}`)
    await this.page.locator(".members-list-container-stretch").waitFor({
      state: "visible",
      timeout: 5000
    })

    return new MembersPage(this.page)
  }

  async settings(): Promise<SettingsPage> {
    await this.page.goto(`${Config.baseUri}/${SettingsPage.path}`)

    return new SettingsPage(this.page)
  }

  async go(): Promise<AdminPage> {
    await this.page.goto(`${Config.baseUri}/${AdminPage.path}`)

    return this
  }
}
