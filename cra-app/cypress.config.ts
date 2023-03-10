import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

const cypressJsonConfig = {
  fileServerFolder: ".",
  fixturesFolder: "./src/fixtures",
 video: true,
 videosFolder: "featureVideos",
  chromeWebSecurity: false,
  specPattern: "cypress/features/**/*.feature",
//  supportFile: "src/support/e2e.ts",
  viewportWidth: 1280,
  viewportHeight: 720,
  baseUrl: "http://localhost:3000",
  env: {
    NO_COMMAND_LOG: 1
  }

};

export default defineConfig({
  e2e: {
    ...cypressJsonConfig,
    setupNodeEvents,
  },
});