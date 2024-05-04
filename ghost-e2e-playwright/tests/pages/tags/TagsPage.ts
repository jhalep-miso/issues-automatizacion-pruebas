import { type Page } from "@playwright/test"
import { Config } from "../../Config"
import { NewTagPage } from "./NewTagPage"

export class TagsPage {

  private static readonly path = "ghost/#/tags"

  constructor(private readonly page: Page) { }

  getTagByName(name: string) {
    return this.page.getByRole("heading", { name })
  }

  async newTag(): Promise<NewTagPage> {
    await this.page.getByRole("link", { name: "New tag", exact: true }).click()

    return new NewTagPage(this.page)
  }

  async go(): Promise<TagsPage> {
    await this.page.goto(`${Config.baseUri}/${TagsPage.path}`)
    // Wait for any title to load from the list of tags
    await this.page.waitForSelector("h3")

    return this
  }
}