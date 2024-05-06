Feature: Create and update Posts

  @user1 @web
  Scenario: Create a post and delete it should not allow to see it
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1" and content "$name_2"
    And I create a new post with title "$name_3" and content "$name_4"
    And I wait for 2 seconds
    And I navigate to the created post
    And I should see the post title "$$name_3" and content "$$name_4"
    When I delete the created post
    And I wait for 2 seconds
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see a "Page not found" error and an error code 404
    And I navigate to the list of posts filtered by "type" "published"
    And I "should" see the post with title "$$name_1" in the list of posts
    And I "should not" see the post with title "$$name_3" in the list of posts