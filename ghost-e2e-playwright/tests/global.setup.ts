import { test as setup } from '@playwright/test'
import { cleanupGhost } from './cleanup'

setup(
  "Delete all created entities in Ghost before running tests",
  ({ page }) => cleanupGhost(page)
)
