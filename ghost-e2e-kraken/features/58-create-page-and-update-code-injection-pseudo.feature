Feature: Create and update Pages

  @user1 @web @pseudo
  Scenario: Create a page and update it with code injection and verify the changes
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new page with title "$sentence_1" and content "$paragraph_1"
    And I wait for 2 seconds
    And I navigate to the created page
    When I update the created page code injection with a "h1" element with id "$name_1" and text "$name_2"
    And I wait for 2 seconds
    And I navigate to the created page
    And I wait for 2 seconds
    Then I should see the page title "$$sentence_1" and content "$$paragraph_1"
    And I should see the page with a "h1" element with id "$$name_1" and text "$$name_2"