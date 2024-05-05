import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { Config } from './Config'

test.beforeEach(async ({ page }) => {
  // Given:
  // I Login with "<EMAIL>" and "<PASSWORD>" (This step is part of the "Given" section of every escenario below)
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create 4 posts with the same tag and validate that the same 4 posts are listed when filtering by tag", async ({ page }) => {
  const tagName = faker.word.words(1)
  const randomPost = () => ({
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [tagName]
  })
  const posts = Array.from({ length: 4 }, randomPost)

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  
  // And I create four new posts with title "$name_1", content "$name_2" and tag "$name_3"
  for (const post of posts) {
    const newPostPage = await postsPage.newPost()
    await newPostPage.create(post)
    await postsPage.go()
  }
  // And I navigate to the tag list
  const tagsPage = await adminPage.tags()
  // And I should see a tag with name "$$name_3" mentioning that it has "4 Posts" associated with said tag
  await tagsPage.goToPostsByTagName(tagName)

  // When

  // I click on the "4 Posts" link
  const postTitles = await postsPage.getAllPostTitles()

  // Then

  // I should see a the 4 Posts that I created initially with their respective titles
  expect(postTitles.sort()).toStrictEqual(posts.map(p => p.title).sort())
})

test("Create a tag, and then associate 4 posts with the same tag. Validate that the same 4 posts are listed when filtering by tag", async ({ page }) => {
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

  // Given:

  const adminPage = new AdminPage(page)
  const tagsPage = await adminPage.tags()
  const newTagPage = await tagsPage.newTag()

  // And I create a new tag with label "$name_3"
  await newTagPage.create(tag)
  await adminPage.go()
  // And I create four new posts with title "$name_1", content "$name_2" and tag "$name_3"
  const postsPage = await adminPage.posts()
  for (const post of posts) {
    const newPostPage = await postsPage.newPost()
    await newPostPage.create(post)
    await postsPage.go()
  }
  // And I navigate to the tag list
  await tagsPage.go()
  // And I should see a tag with name "$$name_3" mentioning that it has "4 Posts" associated with said tag
  await tagsPage.goToPostsByTagName(tag.name)

  // When:

  // I click on the "4 Posts" link
  const postTitles = await postsPage.getAllPostTitles()

  // Then:

  // I should see a the 4 Posts that I created initially with their respective titles
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

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()

  // And I create a new post with title "$name_1", content "$name_2" and tag "$name_3"
  const newPostPage = await postsPage.newPost()
  await newPostPage.create(post)
  // And I navigate to the tag list
  await adminPage.go()
  const tagsPage = await adminPage.tags()
  // And I should see a tag with name "$$name_3" mentioning that it has "1 Posts" associated with said tag
  await tagsPage.goToPostsByTagName(oldTagName)
  // And I edit the previously created post, replacing the tag "$$name_3" by a new tag "$name_4"
  const editPostPage = await postsPage.editPost(post.title)
  await editPostPage.replaceTags([newTagName])
  // And I navigate to the tag list
  await tagsPage.go()
  // And I should see a tag with name "$$name_4" mentioning that it has "1 Posts" associated with said tag, and I should see another tag with name "$$name_3" mentioning that it has "0 Posts" associated with it
  const oldTagNumberPosts = page.locator(`[href="#/tags/${oldTagName}/"]`).filter({
    hasText: "0 posts"
  })
  await expect(oldTagNumberPosts).toBeVisible()

  // When:

  // I click on the "1 Posts" link
  await tagsPage.goToPostsByTagName(newTagName)

  // Then:

  const postTitles = await postsPage.getAllPostTitles()
  // I should see a the Posts that I edited previously
  expect(postTitles).toStrictEqual([post.title])
})

test("If we create a post with a tag, and then delete said tag from the list of tags, we should see that the post information got updated, showing that it has no tags", async ({ page }) => {
  const tagName = faker.word.words(1)
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [tagName]
  }

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()

  // And I create a new post with title "$name_1", content "$name_2" and tag "$name_3"
  const newPostPage = await postsPage.newPost()
  await newPostPage.create(post)
  // And I navigate to the tag list
  await adminPage.go()
  const tagsPage = await adminPage.tags()

  // And I should see a tag with name "$$name_3" mentioning that it has "1 Posts" associated with said tag
  const tagNumberPosts = page.getByTitle(`List posts tagged with '${tagName}'`)
  expect(tagNumberPosts).toHaveText("1 post")
  // And I delete the tag with name "$$name_3"
  const editTagsPage = await tagsPage.editTag(tagName)
  await editTagsPage.delete()
  // And I navigate to the post lists
  await postsPage.go()

  // When:

  // I click on the post with title "$$name_1"
  const editPostPage = await postsPage.editPost(post.title)
  const postTags = await editPostPage.getTags()

  // Then:

  // I should see that the post has no tags
  expect(postTags).toStrictEqual([])
})

test("If we create a post with a tag, and then edit the name said tag from the list of tags, we should see that the post information got updated, showing that the new tag name on its tag list", async ({ page }) => {
  const oldTagName = faker.word.words(1)
  const post = {
    title: faker.word.words(5),
    content: faker.word.words(50),
    tags: [oldTagName]
  }
  const newTagName = faker.word.words(1)

  // Given:

  const adminPage = new AdminPage(page)
  const postsPage = await adminPage.posts()
  // And I create a new post with title "$name_1", content "$name_2" and tag "$name_3"
  const newPostPage = await postsPage.newPost()
  await newPostPage.create(post)
  // And I navigate to the tag list
  await adminPage.go()
  const tagsPage = await adminPage.tags()
  // And I should see a tag with name "$$name_3" mentioning that it has "1 Posts" associated with said tag
  const tagNumberPosts = page.getByTitle(`List posts tagged with '${oldTagName}'`)
  expect(tagNumberPosts).toHaveText("1 post")
  // And I edit the tag's name with another one "$name_4"
  const editTagPage = await tagsPage.editTag(oldTagName)
  await editTagPage.editName(newTagName)
  // And I navigate to the post lists
  await postsPage.go()

  // When:

  // I click on the post with title "$$name_1"
  const editPostPage = await postsPage.editPost(post.title)
  const postTags = await editPostPage.getTags()

  // Then:

  // I should see a that the post has a tag with name "$$nane_4"
  expect(postTags).toStrictEqual([newTagName])
})
