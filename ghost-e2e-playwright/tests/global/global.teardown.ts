import { test as teardown } from '@playwright/test'
import { cleanupGhost } from './cleanup'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { Config } from '../Config'

teardown(
  "Delete all created entities in Ghost during the tests",
  async ({ page }) => {
    const adminPage = await new AdminLoginPage(page, Config.user).signIn()
    await cleanupGhost(adminPage)
  }
)
