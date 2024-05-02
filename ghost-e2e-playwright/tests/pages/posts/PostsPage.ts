import { type Page } from "@playwright/test"
import { NewPostPage } from "./NewPostPage"
import { Config } from "../../Config"

export class PostPage {

  private static readonly path = "ghost/#/posts"

  constructor(private readonly page: Page) { }

  getPostByTitle(title: string) {
    return this.page.getByText(title)
  }

  async newPost(): Promise<NewPostPage> {
    await this.page.getByRole("link", { name: "New post", exact: true }).click()

    return new NewPostPage(this.page)
  }

  async go(): Promise<PostPage> {
    await this.page.goto(`${Config.baseUri}/${PostPage.path}`)

    return this
  }
}
