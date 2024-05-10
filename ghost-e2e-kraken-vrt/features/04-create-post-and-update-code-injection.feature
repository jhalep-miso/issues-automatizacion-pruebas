Feature: Create and update Posts

  @user1 @web
  Scenario: Create a post and update it with code injection and verify the changes
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created post
    When I update the created post code injection with a "h1" element with id "$name_3" and text "$name_4"
    And I wait for 2 seconds
    And I navigate to the created post
    And I wait for 2 seconds
    Then I should see the post title "$$name_1" and content "$$name_2"
    And I should see the post with a "h1" element with id "$$name_3" and text "$$name_4"