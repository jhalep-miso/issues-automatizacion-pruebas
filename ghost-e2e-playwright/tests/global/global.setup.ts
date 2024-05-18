import { test as setup } from '@playwright/test'
import { cleanupGhost } from './cleanup'
import { TestData } from '../ghost-test'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { Config } from '../Config'

setup(
  "Delete all created entities in Ghost before running tests",
  async ({ page }) => {
    await TestData.getProvider()
    const adminPage = await new AdminLoginPage(page, Config.user).signIn()
    await cleanupGhost(adminPage)
  }
)
