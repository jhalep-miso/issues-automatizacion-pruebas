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

test("Create a post and update the access to Members Only and verify the banner message", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
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

  // Given:
  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  // I update the created post access to "Paid-members only"
  await editPostPage.changePostAccess("paid")
  // And I navigate to the created post
  await editPostPage.viewPublished()

  // Then:
  
  // I should see the post title "$$name_1" and a banner with text "This post is for paying subscribers only"
  const expectedText = page.getByText("This post is for paying subscribers only")
  await expect(expectedText).toBeVisible()
})

test("Create a post and change the url to then verify it is being changed and the old url is no longer valid", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:
  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  const oldUrl = await editPostPage.getPublishedUrl()
  
  // I update the post url to the slug of "$name_3"
  await editPostPage.changeUrlSlug("new-url-slug")
  // And I navigate to the created post
  await editPostPage.viewPublished()

  // Then:

  // I should see the post title "$$name_1" and content "$$name_2"
  await expect(page.getByText(post.title, { exact: true })).toBeVisible()
  await expect(page.getByText(post.content, { exact: true })).toBeVisible()

  // And I navigate to the old post url
  await page.goto(oldUrl)
  // And I should see a "Page not found" error and an error code 404
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

  // Given:
  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  // I update the created post code injection with a "h1" element with id "$name_3" and text "$name_4"
  await editPostPage.injectHeaderCode(`<h1 id="${injection.id}">${injection.content}</h1>`)
  // And I navigate to the created post
  await editPostPage.viewPublished()

  // Then :
  // I should see the post title "$$name_1" and content "$$name_2"
  await expect(page.getByText(post.title, { exact: true })).toBeVisible()
  await expect(page.getByText(post.content, { exact: true })).toBeVisible()
  // I should see the post with a "h1" element with id "$$name_3" and text "$$name_4"
  await expect(page.locator(`h1#${injection.id}`)).toHaveText(injection.content)
})

test("Create a post and unpublish it should not allow to see it", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  const oldUrl = await editPostPage.getPublishedUrl()

  // I unpublish the created post
  await editPostPage.unpublish()
  // And I navigate to the created post
  await page.goto(oldUrl)

  // Then:

  // I should see a "Page not found" error and an error code 404
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})

test("Create a post and delete it should not allow to see it", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  // And I create a new post with title "$name_1" and content "$name_2"
  await newPostPage.create(post)
  // And I navigate to the created post
  await postsPage.go()
  const editPostPage = await postsPage.editPost(post.title)

  // When:

  const oldUrl = await editPostPage.getPublishedUrl()

  // I delete the created post
  await editPostPage.delete()
  // And I navigate to the created post
  
  // Then:

  // I should not see the post in the list of posts
  await expect(page.getByText(post.title, { exact: true })).not.toBeVisible()
  // And I should see a "Page not found" error and an error code 404
  await page.goto(oldUrl)
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
})
