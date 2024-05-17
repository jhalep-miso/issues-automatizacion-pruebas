Feature: Create and update Posts

  @user1 @web @pseudo
  Scenario: Create a post and update the access to Members Only and verify the banner message
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$sentence_1" and content "$paragraph_1"
    And I wait for 2 seconds
    And I navigate to the created post
    When I wait for 2 seconds
    And I update the created post access to "Members only"
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see the post title "$$sentence_1" and a banner with text "This post is for subscribers only"

