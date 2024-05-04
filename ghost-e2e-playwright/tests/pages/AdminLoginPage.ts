import { type Page } from "@playwright/test"
import { Config } from "../Config"
import { AdminPage } from "./AdminPage"
import { UserCredentials } from "../domain/UserCredentials"

export class AdminLoginPage {

  private static readonly path = "ghost/#/signin"

  constructor(
    private readonly page: Page,
    private readonly user: UserCredentials
  ) { }

  async signIn(): Promise<AdminPage> {
    await this.page.goto(`${Config.baseUri}/${AdminLoginPage.path}`)

    await this.page.getByPlaceholder("jamie@example.com").fill(this.user.email)

    await this.page.getByPlaceholder("•••••••••••••••").fill(this.user.password)

    await this.page.getByRole("button", { name: "Sign in" }).click()

    await this.page.getByRole("heading", { name: "Dashboard", exact: true }).waitFor({
      state: "visible",
      timeout: 50000
    })

    return new AdminPage(this.page)
  }
}
