Feature: My feature

  @user1 @web
  Scenario: Login in the application
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created post
    When I wait for 2 seconds
    And I update the created post access to "Members Only"
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see the post title "$$name_1" and a banner with text "This post is for subscribers only"

