import { Locator, type Page } from "@playwright/test"
import { NewPostPage } from "./NewPostPage"
import { Config } from "../../Config"
import { EditPostPage } from "./EditPostPage"

export class PostPage {

  private static readonly path = "ghost/#/posts"

  constructor(private readonly page: Page) { }

  getPostByTitle(title: string): Locator {
    return this.page.getByRole("heading", { name: title })
  }

  async editPost(title: string): Promise<EditPostPage> {
    await this.getPostByTitle(title).click()

    return new EditPostPage(this.page)
  }

  async newPost(): Promise<NewPostPage> {
    await this.page.getByTitle("New post").click()

    return new NewPostPage(this.page)
  }

  async go(): Promise<PostPage> {
    await this.page.goto(`${Config.baseUri}/${PostPage.path}`)
    // Wait for any title to load from the list of posts
    await this.page.waitForSelector("h3")

    return this
  }
}
