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

  async getAllPostTitles(): Promise<string[]> {
    const titleLocators = await this.page.locator("h3.gh-content-entry-title").all()

    return Promise.all(titleLocators.map(locator => locator.innerText()))
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
    // Wait for the list of posts to load
    await this.page.locator("div.posts-list").waitFor({
      state: "visible",
      timeout: 5000
    })

    return this
  }
}
