Feature: Edit and view members

  @user1 @web @a-priori
  Scenario: Edit a member from the Impersonate link
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I navigate to the members list
    And I create a new member with name "$name_1" and email "$email"
    And I get the Impersonate link
    When I copy link
    And I navigate to the Impersonate link in another tab
    And I edit member with name "$name_2" from Impersonate link
    And I wait for 2 seconds
    And I return and refresh the members list in the administration panel
    Then I should see the member with name "$$name_2" and email "$$email"