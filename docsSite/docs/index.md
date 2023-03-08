# List of features!
Feature: Search for New York Times on Google
![type:video](./featureVideos/feature1/feature1.feature.mp4)


    Scenario: Open Google and search for New York Times
        Given I am on the Google homepage
        When I search for New York Times
        Then I see search results for New York Times

    Scenario: Open the first link for New York Times
        Given I am on the search results page for New York Times
        When I click on the first search result
        Then I am taken to the New York Times websiteFeature: feature1
![type:video](./featureVideos/feature1/feature1.feature.mp4)


    I want to go to feature1

    Scenario: Goint to use feature1
        Given I am a user
        When I open the website
        Then I should be able to use feature1