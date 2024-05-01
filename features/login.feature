Feature: My feature

  @user1 @web
  Scenario: Login in the application
    Given I Login to "<LOGIN_URL>" with "<EMAIL>" and "<PASSWORD>"
    When I wait
