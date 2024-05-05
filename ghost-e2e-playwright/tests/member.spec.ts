import { faker } from "@faker-js/faker"
import { test, expect } from '@playwright/test'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { Config } from './Config'
import { AdminPage } from './pages/AdminPage'

test.beforeEach(async ({ page }) => {
  await new AdminLoginPage(page, Config.user).signIn()
})

test("Create a member and display it on the members list", async ({ page }) => {
  const member = {
    name: faker.word.words(2),
    email: faker.internet.email(),
    labels: new Array(4).fill(faker.word.words(1)),
    note: faker.word.words(10)
  }

  const adminPage = new AdminPage(page)
  const membersPage = await adminPage.members()
  const newMemberPage = await membersPage.newMember()

  await newMemberPage.create(member)

  await membersPage.go()
  await membersPage.editMember(member.email)

  await expect(page.getByText(member.name).first()).toBeVisible()
  await expect(page.getByText(member.email).first()).toBeVisible()
})

// test("Create a member", async ({ page }) => {
//   const member = {
//     name: "Santiago",
//     email: "santiago@example.com",
//     labels: ["label1", "label2", "label3"],
//     note: "This is a test note"
//   }

//   const adminPage = new AdminPage(page)
//   const membersPage = await adminPage.members()
//   const newMemberPage = await membersPage.newMember()

//   await newMemberPage.create(member)
//   await adminPage.members()

//   await expect(membersPage.getMemberByEmail(member.email)).toHaveText(member.email)
// })
