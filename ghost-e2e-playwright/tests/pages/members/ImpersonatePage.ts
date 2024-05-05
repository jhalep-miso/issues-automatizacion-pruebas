import { type Page } from "@playwright/test"

export class ImpersonatePage {

  constructor(private readonly page: Page) { }

  async editName(name: string): Promise<void> {
    // Sometimes the following fails because a pop up gets in the way of the click
    await this.page.getByRole("link", { name: "Account" }).click()

    await this.page.waitForTimeout(2000)

    const frame = this.page.frameLocator('[data-testid="portal-popup-frame"]')

    await frame.getByRole("button", { name: "Edit" }).click()

    await frame.locator("input#input-name").fill(name)

    await frame.getByRole("button", { name: "Save", exact: true }).click()
  }
}
