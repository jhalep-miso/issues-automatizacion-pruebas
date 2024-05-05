import { type Page } from "@playwright/test"
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'

export const cleanupGhost = async (page: Page): Promise<void> => {
  const adminPage = await new AdminLoginPage(page, Config.user).signIn()

  // Delete all members
  const membersPage = await adminPage.members()
  await membersPage.deleteAllMembers()

  // Delete all Posts, Pages and Tags
  await adminPage.go()
  const settingsPage = await adminPage.settings()
  await settingsPage.deleteAllContent()
}
