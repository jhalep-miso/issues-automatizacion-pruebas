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
