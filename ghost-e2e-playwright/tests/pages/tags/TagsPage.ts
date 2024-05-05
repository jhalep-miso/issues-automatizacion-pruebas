import { type Page } from "@playwright/test"
import { Config } from "../../Config"
import { NewTagPage } from "./NewTagPage"
import { PostPage } from "../posts/PostsPage"
import { EditTagPage } from "./EditTagPage"

export class TagsPage {

  private static readonly path = "ghost/#/tags"

  constructor(private readonly page: Page) { }

  getTagByName(name: string) {
    return this.page.getByRole("heading", { name })
  }

  async goToPostsByTagName(name: string): Promise<PostPage> {
    await this.page.getByTitle(`List posts tagged with '${name}'`).click()

    await this.page.locator(".posts-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return new PostPage(this.page)
  }

  async newTag(): Promise<NewTagPage> {
    await this.page.getByRole("link", { name: "New tag", exact: true }).click()

    return new NewTagPage(this.page)
  }

  async editTag(tagName: string): Promise<EditTagPage> {
    await this.page.getByTitle("Edit tag").filter({ hasText: tagName }).first().click()

    return new EditTagPage(this.page)
  }

  async go(): Promise<TagsPage> {
    await this.page.goto(`${Config.baseUri}/${TagsPage.path}`)
    // Wait for any title to load from the list of tags
    await this.page.waitForSelector("h3")

    return this
  }
}
