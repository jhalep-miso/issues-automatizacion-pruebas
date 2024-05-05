import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { Config } from './Config'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create multiple Post with the same Tag", async ({ page }) => {
  const tagName = faker.word.words(1)
  const randomPost = () => ({
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [tagName]
  })
  const posts = Array.from({ length: 4 }, randomPost)

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()

  for (const post of posts) {
    const newPostPage = await postsPage.newPost()
    await newPostPage.create(post)
    await postsPage.go()
  }

  const tagsPage = await adminPage.tags()
  await tagsPage.goToPostsByTagName(tagName)
  const postTitles = await postsPage.getAllPostTitles()

  expect(postTitles.sort()).toStrictEqual(posts.map(p => p.title).sort())
})

test("Create a tag and associate it with multiple posts", async ({ page }) => {
  const tag = {
    name: faker.word.words(1),
    slug: faker.word.words(1),
    description: faker.word.words(50)
  }
  const randomPost = () => ({
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [tag.name]
  })
  const posts = Array.from({ length: 4 }, randomPost)

  const adminPage = new AdminPage(page)
  const tagsPage = await adminPage.tags()
  const newTagPage = await tagsPage.newTag()

  await newTagPage.create(tag)
  await adminPage.go()

  const postsPage = await adminPage.posts()
  for (const post of posts) {
    const newPostPage = await postsPage.newPost()
    await newPostPage.create(post)
    await postsPage.go()
  }

  await tagsPage.go()
  await tagsPage.goToPostsByTagName(tag.name)
  const postTitles = await postsPage.getAllPostTitles()

  expect(postTitles.sort()).toStrictEqual(posts.map(p => p.title).sort())
})

test("If we replace the tag of an exisiting post by another one, the change should be reflected when listing the posts", async ({ page }) => {
  const oldTagName = faker.word.words(1)
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [oldTagName]
  }
  const newTagName = faker.word.words(1)

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  const newPostPage = await postsPage.newPost()
  await newPostPage.create(post)

  await adminPage.go()
  const tagsPage = await adminPage.tags()
  await tagsPage.goToPostsByTagName(oldTagName)
  const editPostPage = await postsPage.editPost(post.title)
  await editPostPage.replaceTags([newTagName])

  await tagsPage.go()
  // Check that the old tag has 0 posts associated to it
  const oldTagNumberPosts = page.locator(`[href="#/tags/${oldTagName}/"]`).filter({
    hasText: "0 posts"
  })
  await expect(oldTagNumberPosts).toBeVisible()

  await tagsPage.goToPostsByTagName(newTagName)
  const postTitles = await postsPage.getAllPostTitles()
  expect(postTitles).toStrictEqual([post.title])
})
