import { test as teardown } from '@playwright/test'
import { cleanupGhost } from './cleanup'

teardown(
  "Delete all created entities in Ghost during the tests",
  ({ page }) => cleanupGhost(page)
)
