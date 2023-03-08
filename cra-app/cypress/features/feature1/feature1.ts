// Import the required modules
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Define the steps of the scenario
Given("I am on the Google homepage", () => {
  cy.displayTextIfCypressIsInDocumentationMode("I am on the Google homepage")
  cy.visit("https://www.google.com");
  cy.get('#L2AGLb > .QS5gu').click()
});

When('I search for New York Times', () => {
  cy.displayTextIfCypressIsInDocumentationMode("I search for New York Times")
  cy.get('[name="q"]').type("New York Times").type("{enter}");
});

Then('I see search results for New York Times', () => {
  cy.displayTextIfCypressIsInDocumentationMode("I see search results for New York Times")

  cy.url().should("include", "search");

});

Given('I am on the search results page for New York Times', () => {
  cy.displayTextIfCypressIsInDocumentationMode("I am on the search results page for New York Times")
  cy.visit(`https://www.google.com/search?q=New York Times`);
  cy.get('#L2AGLb > .QS5gu').click()

});

When("I click on the first search result", () => {
  cy.displayTextIfCypressIsInDocumentationMode("I click on the first search result")
  cy.get("#search").find("a").first().click();
});

Then("I am taken to the New York Times website", () => {
  cy.displayTextIfCypressIsInDocumentationMode("I am taken to the New York Times website")
  cy.url().should("include", "nytimes.com");
});
