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

test("Create a post", async ({ page }) => {
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50)
  }

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()

  await newPostPage.create(post)
  await postsPage.go()

  await expect(postsPage.getPostByTitle(post.title)).toHaveText(post.title)
})
