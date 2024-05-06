Feature: Delete tags of a post

  @user1 @web
  Scenario: If we create a post with a tag, and then delete said tag from the list of tags, we should see that the post information got updated, showing that it has no tags
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$name_3"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I wait for 2 seconds
    And I should see a tag with name "$$name_3" mentioning that it has "1 post" associated with said tag
    And I delete the tag with name "$$name_3"
    And I wait for 2 seconds
    When I navigate to the created post
    And I wait for 2 seconds
    Then I should see that the post has no tags
