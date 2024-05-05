import { type Page } from "@playwright/test"

export class ImpersonatePage {

  constructor(private readonly page: Page) { }

  async editName(name: string): Promise<void> {
    await this.page.getByRole("link", { name: "Account" }).click()

    const frame = this.page.frameLocator('[data-testid="portal-popup-frame"]')

    await frame.getByRole("button", { name: "Edit" }).click()

    await frame.locator("input#input-name").fill(name)

    await frame.getByRole("button", { name: "Save" }).click()
  }
}
