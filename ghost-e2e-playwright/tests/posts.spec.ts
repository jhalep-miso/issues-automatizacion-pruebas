import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { SettingsPage } from './pages/settings/SettingsPage'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test.afterEach(async ({ page }) => {
  const settingsPage = new SettingsPage(page)

  await settingsPage.go()
  await settingsPage.deleteAllContent()
})

test("Create a post", async ({ page }) => {
  const post = {
    title: "Test Post Title",
    content: "My test post content"
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()

  expect(postsPage.getPostByTitle(post.title)).toHaveText(post.title)
})
