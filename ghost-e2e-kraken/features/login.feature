Feature: Login feature

  @user1 @web
  Scenario: Login in the application
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    When I wait
