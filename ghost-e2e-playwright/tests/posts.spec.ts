import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  // Given: (This step is part of the "Given" section of every escenario below)
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a post and update the access to Members Only and verify the banner message", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  //And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  // I update the created post access to "Members only"
  await editPostPage.changePostAccess("members")
  // And I navigate to the created post
  await editPostPage.viewPublished()

  // Then:

  // I should see the post title "$$name_1" and a banner with text "This post is for subscribers only"
  const expectedText = page.getByText("This post is for subscribers only")
  await expect(expectedText).toBeVisible()
})

test("Create a post and update the access to Paid-members Only and verify the banner message", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  await editPostPage.changePostAccess("paid")
  await editPostPage.viewPublished()

  const expectedText = page.getByText("This post is for paying subscribers only")
  await expect(expectedText).toBeVisible()
})

test("Create a post and change the url to then verify it is being changed and the old url is no longer valid", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  const oldUrl = await editPostPage.getPublishedUrl()

  await editPostPage.changeUrlSlug("new-url-slug")
  await editPostPage.viewPublished()

  await expect(page.getByText(post.title, { exact: true })).toBeVisible()
  await expect(page.getByText(post.content, { exact: true })).toBeVisible()

  await page.goto(oldUrl)
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})

test("Create a post and update it with code injection and verify the changes", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }
  const injection = {
    id: faker.string.alpha(4),
    content: faker.string.alphanumeric(10)
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  await editPostPage.injectHeaderCode(`<h1 id="${injection.id}">${injection.content}</h1>`)
  await editPostPage.viewPublished()

  await expect(page.locator(`h1#${injection.id}`)).toHaveText(injection.content)
})

test("Create a post and unpublish it should not allow to see it", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  const oldUrl = await editPostPage.getPublishedUrl()
  await editPostPage.unpublish()

  await page.goto(oldUrl)
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})
