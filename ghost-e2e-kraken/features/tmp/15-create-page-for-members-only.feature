Feature: Create and update Pages

  @user1 @web
  Scenario: Create a page and update the access to Members Only and verify the banner message
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new page with title "$name_1" and content "$name_2"
    And I wait for 2 seconds
    And I navigate to the created page
    When I wait for 2 seconds
    And I update the created page access to "Members only"
    And I navigate to the created page
    And I wait for 2 seconds
    Then I should see the page title "$$name_1" and a banner with text "This page is for subscribers only"

