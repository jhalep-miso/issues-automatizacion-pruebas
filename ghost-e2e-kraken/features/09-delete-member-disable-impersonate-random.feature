Feature: Delete member
  @user1 @web @random
  Scenario: Delete a member and verify that their access is restricted afterwards
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I navigate to the members list
    And I create a new member with name "$name_1" and email "$email"
    And I get the Impersonate link
    And I copy link
    When I select delete member option
    And I confirm delete member
    And I navigate to the Impersonate link in another tab
    Then I should see a message error which say Could not sign in. Login link expired