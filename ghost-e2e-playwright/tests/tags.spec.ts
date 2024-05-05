import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { Config } from './Config'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a tag", async ({ page }) => {
  const tag = {
    name: "MyTestTag",
    slug: "my-test-slug",
    description: "My test tag description"
  }

  const adminPage = new AdminPage(page)
  const tagsPage = await adminPage.tags()
  const newTagPage = await tagsPage.newTag()

  await newTagPage.create(tag)
  await tagsPage.go()

  await expect(tagsPage.getTagByName(tag.name)).toHaveText(tag.name)
})
