import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'

test("Create a blog page", async ({ page }) => {
  const blogPage = {
    title: "Test Blog Page Title",
    content: "My test blog page content"
  }

  const adminPage = await new AdminLoginPage(page, Config.user).signIn()
  const blogPagesPage = await adminPage.pages()
  const newBlogPagePage = await blogPagesPage.newPage()

  await newBlogPagePage.create(blogPage)
  await blogPagesPage.go()

  expect(blogPagesPage.getBlogPageByTitle(blogPage.title)).toHaveText(blogPage.title)
})
