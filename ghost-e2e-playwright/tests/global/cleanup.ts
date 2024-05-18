import { AdminPage } from "../pages/AdminPage"

export const cleanupGhost = async (adminPage: AdminPage): Promise<void> => {
  // const adminPage = await new AdminLoginPage(page, Config.user).signIn()

  // Delete all members
  const membersPage = await adminPage.members()
  await membersPage.deleteAllMembers()

  // Delete all Posts, Pages and Tags
  await adminPage.go()
  const settingsPage = await adminPage.settings()
  await settingsPage.deleteAllContent()
}
