Feature: Create and update Posts

  @user1 @web @a-priori
  Scenario: Create a post and unpublish it should not allow to see it
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$sentence_1" and content "$paragraph_1"
    And I wait for 2 seconds
    And I navigate to the created post
    And I should see the post title "$$sentence_1" and content "$$paragraph_1"
    When I unpublish the created post
    And I wait for 2 seconds
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see a "Page not found" error and an error code 404