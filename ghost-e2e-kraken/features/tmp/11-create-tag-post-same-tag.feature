Feature: Create multiple Post with the same Tag

  @user1 @web
  Scenario: Create a tag, and then associate 4 posts with the same tag. Validate that the same 4 posts are listed when filtering by tag
    Given I Login with "<EMAIL>" and "<PASSWORD>"
    And I wait for 2 seconds
    And I create a new tag with label "$name_3"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$$name_3"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$$name_3"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$$name_3"
    And I wait for 2 seconds
    And I create a new post with title "$name_1", content "$name_2" and tag "$$name_3"
    And I wait for 2 seconds
    And I navigate to the tag list
    And I should see a tag with name "$$name_3" mentioning that it has "4 posts" associated with said tag
    When I click on the "4 posts" link from the tag with name "$$name_3"
    And I wait for 2 seconds
    Then I should see the 4 Posts that I created initially with their respective titles with tag "$$name_3"
    And I wait for 2 seconds