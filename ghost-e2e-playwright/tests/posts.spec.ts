import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'

test("Create a post", async ({ page }) => {
  const post = {
    title: "Test Post Title",
    content: "My test post content"
  }

  const adminPage = await new AdminLoginPage(page, Config.user).signIn()
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()

  expect(postsPage.getPostByTitle(post.title)).toHaveText(post.title)
})
