import { type Page } from "@playwright/test"
import { Member } from "../../domain/Member";

export class NewMemberPage {

  constructor(private readonly page: Page) { }

  async create(member: Member): Promise<void> {
    await this.page.locator("input#member-name").fill(member.name)

    await this.page.locator("input#member-email").fill(member.email)

    const labelsInput = this.page.locator("input.ember-power-select-trigger-multiple-input")
    for (const label of member.labels) {
      await labelsInput.fill(label)
      await labelsInput.press("Enter")
    }

    const noteInput = this.page.getByRole("textbox", { name: "Note" })
    await noteInput.click() // This is just so that the "Labels" search bar dissapears
    await noteInput.fill(member.note)

    await this.page.getByRole("button", { name: "Save" }).click()

    await this.page.getByText("Created — ").waitFor({
      state: "visible",
      timeout: 5000
    })
  }
}
