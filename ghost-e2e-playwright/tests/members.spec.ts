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

test("Create a member and display it on the members list", async ({ page }) => {
  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }

  // Given:
  
  //And I navigate to the members list
  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()

  // When:

  // I create a new member with name "$name1" and email "$email"
  const newMemberPage = await membersPage.newMember()
  await newMemberPage.create(member)
  // And I navigate to the members list
  await membersPage.go()
  // And I navigate to the created member
  await membersPage.editMember(member.email)

  // Then:

  // I should see the detailed information of the created member.
  await expect(page.getByText(member.name).first()).toBeVisible()
  await expect(page.getByText(member.email).first()).toBeVisible()
})

test("Edit a member from the Impersonate link", async ({ page }) => {

  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }
  const newName = faker.word.words(2)

  // Given:

  // And I navigate to the members list
  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  
  // And I create a new member with name "$name_1" and email "$email"
  const newMemberPage = await membersPage.newMember()
  await newMemberPage.create(member)
  // And I get the Impersonate link
  await membersPage.go()
  const editMemberPage = await membersPage.editMember(member.email)

  // When:

  // I navigate to the Impersonate link in another tab
  const impersonatePage = await editMemberPage.impersonate()
  // And I edit member with name "$name_2" from Impersonate link
  await impersonatePage.editName(newName)
  // And I return and refresh the memebers list in the administration panel
  await membersPage.go()

  // Then:

  // I should see the member with name "$$name_2" and email "$$email"
  await expect(page.getByText(newName)).toBeVisible()
})

test("Delete a member and verify that their access is restricted afterwards", async ({ page }) => {
  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }

  // Given:

  // And I navigate to the members list
  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()

  // And I create a new member with name "$name_1" and email "$email"
  const newMemberPage = await membersPage.newMember()
  await newMemberPage.create(member)

  // And I get the Impersonate link
  // And I copy link
  await membersPage.go()
  const editMemberPage = await membersPage.editMember(member.email)
  const impersonateUrl = await editMemberPage.getImpersonateUrl()

  // When:

  // I select delete member option
  // And I confirm delete memeber
  await editMemberPage.delete()
  // And I navigate to the Impersonate link in another tab
  await page.goto(impersonateUrl)

  // Then:

  const notificationFrame = page.frameLocator(".gh-portal-notification-iframe")
  // I should see a message error which say Could not sign in. Login link expired
  await expect(notificationFrame.getByText("Could not sign in. Login link expired.")).toBeVisible()
})
