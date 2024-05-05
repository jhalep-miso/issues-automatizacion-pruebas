import { test as teardown } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'

teardown("Delete all created entities in Ghost", async ({ page }) => {
  const adminPage = await new AdminLoginPage(page, Config.user).signIn()

  // Delete all members
  const membersPage = await adminPage.members()
  await membersPage.deleteAllMembers()

  // Delete all Posts, Pages and Tags
  await adminPage.go()
  const settingsPage = await adminPage.settings()
  await settingsPage.deleteAllContent()
})
