import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  // Given:
  // I Login with "<EMAIL>" and "<PASSWORD>" (This step is part of the "Given" section of every escenario below)
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a page and update the access to Members Only and verify the banner message", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  // I update the created page access to "Members only"
  await editpagePage.changePageAccess("members")
  // And I navigate to the created page
  await editpagePage.viewPublished()

  // Then:

  // I should see the page title "$$name_1" and a banner with text "This page is for subscribers only"
  const expectedText = page.getByText("This page is for subscribers only")
  await expect(expectedText).toBeVisible()
})

test("Create a page and update the access to Paid-members Only and verify the banner message", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  // I update the created page access to "Paid-members only"
  await editpagePage.changePageAccess("paid")
  // And I navigate to the created page
  await editpagePage.viewPublished()

  // Then:

  // I should see the page title "$$name_1" and a banner with text "This page is for paying subscribers only"
  const expectedText = page.getByText("This page is for paying subscribers only")
  await expect(expectedText).toBeVisible()
})

test("Create a page and change the url to then verify it is being changed and the old url is no longer valid", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  const oldUrl = await editpagePage.getPublishedUrl()

  // I update the page url to the slug of "$name_3"
  await editpagePage.changeUrlSlug("new-url-slug")
  // And I navigate to the created page
  await editpagePage.viewPublished()

  // Then:

  // I should see the page title "$$name_1" and content "$$name_2"
  await expect(page.getByText(blogPage.title, { exact: true })).toBeVisible()
  await expect(page.getByText(blogPage.content, { exact: true })).toBeVisible()

  // And I navigate to the old page url
  await page.goto(oldUrl)
  // And I should see a "Page not found" error and an error code 404
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})

test("Create a page and update it with code injection and verify the changes", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }
  const injection = {
    id: faker.string.alpha(4),
    content: faker.string.alphanumeric(10)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  // I update the created page code injection with a "h1" element with id "$name_3" and text "$name_4"
  await editpagePage.injectHeaderCode(`<h1 id="${injection.id}">${injection.content}</h1>`)
  // And I navigate to the created page
  await editpagePage.viewPublished()

  // Then :
  // I should see the page title "$$name_1" and content "$$name_2"
  await expect(page.getByText(blogPage.title, { exact: true })).toBeVisible()
  await expect(page.getByText(blogPage.content, { exact: true })).toBeVisible()
  // I should see the page with a "h1" element with id "$$name_3" and text "$$name_4"
  await expect(page.locator(`h1#${injection.id}`)).toHaveText(injection.content)
})

test("Create a page and unpublish it should not allow to see it", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:

  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  const oldUrl = await editpagePage.getPublishedUrl()

  // I unpublish the created page
  await editpagePage.unpublish()
  // And I navigate to the created page
  await page.goto(oldUrl)

  // Then:

  // I should see a "Page not found" error and an error code 404
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})

test("Create a page and delete it should not allow to see it", async ({ page }) => {
  const blogPage = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:

  const adminPage = new AdminPage(page)
  const pagesPage = await adminPage.pages()
  const newpagePage = await pagesPage.newPage()

  // And I create a new page with title "$name_1" and content "$name_2"
  await newpagePage.create(blogPage)
  // And I navigate to the created page
  await pagesPage.go()
  const editpagePage = await pagesPage.editPage(blogPage.title)

  // When:

  const oldUrl = await editpagePage.getPublishedUrl()

  // I delete the created page
  await editpagePage.delete()
  // And I navigate to the created page

  // Then:

  // I should not see the page in the list of pages
  await expect(page.getByText(blogPage.title, { exact: true })).not.toBeVisible()
  // And I should see a "Page not found" error and an error code 404
  await page.goto(oldUrl)
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})
