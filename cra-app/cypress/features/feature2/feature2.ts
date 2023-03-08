import { Given,When,Then } from "@badeball/cypress-cucumber-preprocessor";

  Given(`I am a user`, () => {
 cy.visit("/")
 cy.displayTextIfCypressIsInDocumentationMode("I am a user`")
  });
  When(`I open the website`, () => {
    cy.displayTextIfCypressIsInDocumentationMode("I open the website")

  });
  Then(`I should be able to use feature1`, () => {
    cy.displayTextIfCypressIsInDocumentationMode("I should be able to use feature1")


    
});