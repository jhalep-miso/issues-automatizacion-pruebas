Feature: Edit a tag from a post

  @user1 @web
  Scenario:If we replace the tag of an existing post with another one, the change should be reflected when listing the posts
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$name_3"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I wait for 2 seconds
    And I should see a tag with name "$$name_3" mentioning that it has "1 post" associated with said tag
    And I wait for 2 seconds
    And I edit the previously created post, replacing the tag "$$name_3" by a new tag "$name_4"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I wait for 2 seconds
    And I should see a tag with name "$$name_4" mentioning that it has "1 post" associated with said tag
    When I click on the "1 post" link from the tag with name "$$name_4"
    And I wait for 2 seconds
    Then I should see the Post that I created initially with their respective titles with tag "$$name_4"
