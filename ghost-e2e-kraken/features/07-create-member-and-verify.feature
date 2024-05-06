Feature: Create and view members

  @user1 @web
  Scenario: Create a member and display it on the members list
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I navigate to the members list
    When I create a new member with name "$name1" and email "$email"
    And I wait for 2 seconds
    And I navigate to the members list
    Then I should see the member with name "$$name1" and email "$$email"
    When I navigate to the created member
    And I wait for 2 seconds
    Then I should see the "$$name1" and "$$email" of the created member.