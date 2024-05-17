Feature: Create and update Posts

  @user1 @web @random
  Scenario: Create a post and delete it should not allow to see it
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$sentence_1" and content "$paragraph_1"
    And I create a new post with title "$sentence_2" and content "$paragraph_2"
    And I wait for 2 seconds
    And I navigate to the created post
    And I should see the post title "$$sentence_2" and content "$$paragraph_2"
    When I delete the created post
    And I wait for 2 seconds
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see a "Page not found" error and an error code 404
    And I navigate to the list of posts filtered by "type" "published"
    And I "should" see the post with title "$$sentence_1" in the list of posts
    And I "should not" see the post with title "$$sentence_2" in the list of posts