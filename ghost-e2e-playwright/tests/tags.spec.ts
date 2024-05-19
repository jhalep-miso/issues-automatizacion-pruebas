import { expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminPage } from './pages/AdminPage'
import { Config } from './Config'
import { DataGenerationProvider, genModes, test } from "./ghost-test"
import { cleanupGhost } from "./global/cleanup"
import { Tag } from "./domain/Tag"

test.beforeEach(async ({ page }) => {
  // Given:
  // I Login with "<EMAIL>" and "<PASSWORD>" (This step is part of the "Given" section of every escenario below)
  await new AdminLoginPage(page, Config.user).signIn()
})

for (const mode of genModes) {
  let triggerCleanup = false

  const genTagName = (dataProvider: DataGenerationProvider) =>
    dataProvider.select[mode].generateName().toLocaleLowerCase()

  const genTag = (dataProvider: DataGenerationProvider) => {
    const gen = dataProvider.select[mode]
    return {
      name: genTagName(dataProvider),
      slug: gen.generateName(),
      description: gen.generateSentence()
    }
  }

  const genPost = (dataProvider: DataGenerationProvider, tags: Tag[]) => {
    const gen = dataProvider.select[mode]
    return {
      title: gen.generateName(),
      content: gen.generateParagraph(),
      tags: tags.map(tag => tag.name)
    }
  }

  test.describe(`Ghost tests for Tags with ${mode} data generation`, () => {

    test.afterEach(async ({ page }) => {
      if (triggerCleanup) {
        const adminPage = new AdminPage(page)
        await adminPage.go()
        await cleanupGhost(adminPage)
      }
    })

    test("Create 4 posts with the same tag and validate that the same 4 posts are listed when filtering by tag", async ({ page, dataProvider }) => {
      const tag = genTag(dataProvider)
      const posts = Array.from({ length: 4 }, () => genPost(dataProvider, [tag]))

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
      await tagsPage.goToPostsByTagName(tag.name)

      // When

      // I click on the "4 Posts" link
      const postTitles = await postsPage.getAllPostTitles()

      // Then

      // I should see a the 4 Posts that I created initially with their respective titles
      expect(postTitles.sort()).toStrictEqual(posts.map(p => p.title).sort())
    })

    test("Create a tag, and then associate 4 posts with the same tag. Validate that the same 4 posts are listed when filtering by tag", async ({ page, dataProvider }) => {
      const tag = genTag(dataProvider)
      const posts = Array.from({ length: 4 }, () => genPost(dataProvider, [tag]))

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

    test("If we replace the tag of an exisiting post by another one, the change should be reflected when listing the posts", async ({ page, dataProvider }) => {
      const oldTag = genTag(dataProvider)
      const post = genPost(dataProvider, [oldTag])
      const newTagName = genTagName(dataProvider)

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
      await tagsPage.goToPostsByTagName(oldTag.name)
      // And I edit the previously created post, replacing the tag "$$name_3" by a new tag "$name_4"
      const editPostPage = await postsPage.editPost(post.title)
      await editPostPage.replaceTags([newTagName])
      // And I navigate to the tag list
      await tagsPage.go()
      // And I should see a tag with name "$$name_4" mentioning that it has "1 Posts" associated with said tag, and I should see another tag with name "$$name_3" mentioning that it has "0 Posts" associated with it
      const oldTagNumberPosts = page.locator(`[href="#/tags/${oldTag.name}/"]`).filter({
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

    test("If we create a post with a tag, and then delete said tag from the list of tags, we should see that the post information got updated, showing that it has no tags", async ({ page, dataProvider }) => {
      const tag = genTag(dataProvider)
      const post = genPost(dataProvider, [tag])

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
      const tagNumberPosts = page.getByTitle(`List posts tagged with '${tag.name}'`)
      expect(tagNumberPosts).toHaveText("1 post")
      // And I delete the tag with name "$$name_3"
      const editTagsPage = await tagsPage.editTag(tag.name)
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

    test("If we create a post with a tag, and then edit the name said tag from the list of tags, we should see that the post information got updated, showing that the new tag name on its tag list", async ({ page, dataProvider }) => {
      triggerCleanup = true
      const oldTag = genTag(dataProvider)
      const post = genPost(dataProvider, [oldTag])
      const newTagName = genTagName(dataProvider)

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
      const tagNumberPosts = page.getByTitle(`List posts tagged with '${oldTag.name}'`)
      expect(tagNumberPosts).toHaveText("1 post")
      // And I edit the tag's name with another one "$name_4"
      const editTagPage = await tagsPage.editTag(oldTag.name)
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

  })
}
