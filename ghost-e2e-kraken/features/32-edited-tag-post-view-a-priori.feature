Feature: Edit a tag from a post

  @user1 @web @a-priori
  Scenario:If we replace the tag of an existing post with another one, the change should be reflected when listing the posts
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$sentence_1", content "$paragraph_1" and tag "$name_1"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I wait for 2 seconds
    And I should see a tag with name "$$name_1" mentioning that it has "1 post" associated with said tag
    And I wait for 2 seconds
    And I edit the previously created post, replacing the tag "$$name_1" by a new tag "$name_2"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I wait for 2 seconds
    And I should see a tag with name "$$name_2" mentioning that it has "1 post" associated with said tag
    When I click on the "1 post" link from the tag with name "$$name_2"
    And I wait for 2 seconds
    Then I should see the Post that I created initially with their respective titles with tag "$$name_2"
