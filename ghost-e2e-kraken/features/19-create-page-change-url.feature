Feature: Create and update Pages

  @user1 @web
  Scenario: Create a page and change the url to then verify it is being changed and the old url is no longer valid
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new page with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created page
    When I update the page url to the slug of "$name_3"
    And I wait for 2 seconds
    And I navigate to the created page
    Then I should see the page title "$$name_1" and content "$$name_2"
    And I wait for 2 seconds
    And I navigate to the old page url
    And I should see a "Page not found" error and an error code 404