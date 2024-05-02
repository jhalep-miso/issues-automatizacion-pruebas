import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'

test("Create a tag", async ({ page }) => {
  const tag = {
    name: "MyTestTag",
    slug: "my-test-slug",
    description: "My test tag description"
  }

  const adminPage = await new AdminLoginPage(page, Config.user).signIn()
  const tagsPage = await adminPage.tags()
  const newTagPage = await tagsPage.newTag()

  await newTagPage.create(tag)
  await tagsPage.go()

  expect(tagsPage.getTagByName(tag.name)).toHaveText(tag.name)
})
