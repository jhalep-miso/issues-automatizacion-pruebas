Feature: Create and update Pages

  @user1 @web
  Scenario: Create a page and unpublish it should not allow to see it
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new page with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created page
    And I should see the page title "$$name_1" and content "$$name_2"
    When I unpublish the created page
    And I wait for 2 seconds
    And I navigate to the created page
    And I wait for 2 seconds
    Then I should see a "Page not found" error and an error code 404