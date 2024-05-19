import { expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'
import { DataGenerationProvider, genModes, test } from "./ghost-test"
import { cleanupGhost } from "./global/cleanup"

test.beforeEach(async ({ page }) => {
  // Given:
  // I Login with "<EMAIL>" and "<PASSWORD>" (This step is part of the "Given" section of every escenario below)
  await new AdminLoginPage(page, Config.user).signIn()
})

for (const mode of genModes) {
  let triggerCleanup = false

  const genPost = (dataProvider: DataGenerationProvider) => {
    const gen = dataProvider.select[mode]
    return {
      title: gen.generateName(),
      content: gen.generateParagraph(),
      tags: []
    }
  }

  const genInjection = (dataProvider: DataGenerationProvider) => {
    const gen = dataProvider.select[mode]
    return {
      id: gen.generateName().toLocaleLowerCase(),
      content: gen.generateSentence()
    }
  }

  test.describe(`Ghost tests for Posts with ${mode} data generation`, () => {

    test.afterEach(async ({ page }) => {
      if (triggerCleanup) {
        const adminPage = new AdminPage(page)
        await adminPage.go()
        await cleanupGhost(adminPage)
      }
    })

    test("Create a post and update the access to Members Only and verify the banner message", async ({ page, dataProvider }) => {
      const post = genPost(dataProvider)

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

    test("Create a post and update the access to Paid-members Only and verify the banner message", async ({ page, dataProvider }) => {
      const post = genPost(dataProvider)

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

    test("Create a post and change the url to then verify it is being changed and the old url is no longer valid", async ({ page, dataProvider }) => {
      const post = genPost(dataProvider)

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

    test("Create a post and update it with code injection and verify the changes", async ({ page, dataProvider }) => {
      const post = genPost(dataProvider)
      const injection = genInjection(dataProvider)

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

    test("Create a post and unpublish it should not allow to see it", async ({ page, dataProvider }) => {
      const post = genPost(dataProvider)

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

    test("Create a post and delete it should not allow to see it", async ({ page, dataProvider }) => {
      triggerCleanup = true
      const post = genPost(dataProvider)

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

  })
}
