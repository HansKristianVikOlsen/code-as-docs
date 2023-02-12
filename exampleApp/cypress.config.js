//import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
 import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
 import * as createBundler from "@bahmutov/cypress-esbuild-preprocessor";
 import { defineConfig } from "cypress";
 import pkg from '@badeball/cypress-cucumber-preprocessor';
const { addCucumberPreprocessorPlugin } = pkg;

 async function setupNodeEvents(on, config) {
   // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
   await addCucumberPreprocessorPlugin(on, config);
   require("@cypress/code-coverage/task")(on, config);
   on("file:preprocessor", require("@cypress/code-coverage/use-babelrc"));
   on(
     "file:preprocessor",
     createBundler({
       plugins: [createEsbuildPlugin(config)]
     })
   );

   // Make sure to return the config object as it might have been modified by the plugin.
   return config;
 }

 const cypressJsonConfig = {
   fileServerFolder: ".",
   fixturesFolder: "./src/fixtures",
   //video: true,
   chromeWebSecurity: false,
   specPattern: "cypress/features/*.feature",
   //supportFile: "src/support/e2e.ts",
   viewportWidth: 1920,
   viewportHeight: 1080,
 };
 export default defineConfig({
   e2e: {
     ...cypressJsonConfig,
     setupNodeEvents: setupNodeEvents
   }
 });