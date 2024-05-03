Feature: Create a post and update the url slug

  @user1 @web
  Scenario: Change the url of a post and verify it is being changed in the
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created post
    When I update the post url to the slug of "$name_3"
    And I wait for 2 seconds
    And I navigate to the created post
    Then I should see the post title "$$name_1" and content "$$name_2"
    And I wait for 2 seconds
    And I navigate to the old post url
    And I should see a "Page not found" error and an error code 404