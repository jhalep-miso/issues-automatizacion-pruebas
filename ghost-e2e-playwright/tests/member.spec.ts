import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a member", async ({ page }) => {
  const member = {
    name: "Santiago",
    email: "santiago@example.com",
    labels: ["label1", "label2", "label3"],
    note: "This is a test note"
  }

  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  const newMemberPage = await membersPage.newMember()

  await newMemberPage.create(member)
  await adminPage.members()

  expect(membersPage.getMemberByEmail(member.email)).toHaveText(member.email)
})
