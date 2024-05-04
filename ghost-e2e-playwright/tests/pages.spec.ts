import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a blog page", async ({ page }) => {
  const blogPage = {
    title: "Test Blog Page Title",
    content: "My test blog page content"
  }

  const adminPage = new AdminPage(page)
  const blogPagesPage = await adminPage.pages()
  const newBlogPagePage = await blogPagesPage.newPage()

  await newBlogPagePage.create(blogPage)
  await blogPagesPage.go()

  expect(blogPagesPage.getBlogPageByTitle(blogPage.title)).toHaveText(blogPage.title)
})
