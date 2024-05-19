Feature: Create and update Pages

  @user1 @web @pseudo
  Scenario: Create a page and delete it should not allow to see it
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new page with title "$sentence_1" and content "$paragraph_1"
    And I create a new page with title "$sentence_2" and content "$paragraph_2"
    And I wait for 2 seconds
    And I navigate to the created page
    And I should see the page title "$$sentence_2" and content "$$paragraph_2"
    When I delete the created page
    And I wait for 2 seconds
    And I navigate to the created page
    And I wait for 2 seconds
    Then I should see a "Page not found" error and an error code 404
    And I navigate to the list of pages filtered by "type" "published"
    And I wait for 2 seconds
    And I "should" see the page with title "$$sentence_1" in the list of pages
    And I "should not" see the page with title "$$sentence_2" in the list of pages