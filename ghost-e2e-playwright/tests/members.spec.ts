import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a member and display it on the members list", async ({ page }) => {
  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }

  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  const newMemberPage = await membersPage.newMember()

  await newMemberPage.create(member)

  await membersPage.go()
  await membersPage.editMember(member.email)

  await expect(page.getByText(member.name).first()).toBeVisible()
  await expect(page.getByText(member.email).first()).toBeVisible()
})

test("Edit a member from the Impersonate link", async ({ page, context }) => {
  // await context.grantPermissions(["clipboard-read", "clipboard-write"])

  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }
  const newName = faker.word.words(2)

  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  const newMemberPage = await membersPage.newMember()

  await newMemberPage.create(member)

  await membersPage.go()
  const editMemberPage = await membersPage.editMember(member.email)

  const impersonatePage = await editMemberPage.impersonate()
  await impersonatePage.editName(newName)

  await membersPage.go()

  await expect(page.getByText(newName)).toBeVisible()
})

test("Delete a member and verify that their access is restricted afterwards", async ({ page }) => {
  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }

  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  const newMemberPage = await membersPage.newMember()

  await newMemberPage.create(member)

  await membersPage.go()
  const editMemberPage = await membersPage.editMember(member.email)
  const impersonateUrl = await editMemberPage.getImpersonateUrl()

  await editMemberPage.delete()

  await page.goto(impersonateUrl)
  const notificationFrame = page.frameLocator(".gh-portal-notification-iframe")
  await expect(notificationFrame.getByText("Could not sign in. Login link expired.")).toBeVisible()
})
