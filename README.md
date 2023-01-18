# Generating documentation based on code with cypress and Gherkins

Creating end-user documention yourself is boring, why not automate it so you do not have to? Here are some reasons why you should consider it

1. They are always up to date. Nobody will bother creating how-to videos twice, so once you make one, it is already outdated
2. It is easy if you already are using cypress
3. Other reasons

## How to set it up

In this guide, it is assumed that a documentation site using `mkdocs` is already in place

### Quick step by step guide

1. You need cypress installed on your project. If not, install it and set it up
2. Install cypress gherking package by following their [guide]([https://www.npmjs.com/package/cypress-cucumber-preprocessor](https://www.npmjs.com/package/@badeball/cypress-cucumber-preprocessor))
3. Create the `Feature` folder in location `Cypress/e2e`. '.feature' files should be places here.
4. Create a seperate folder for each feature in the same location. If feature file is named `login.feature` the folder should be named `login`
5. Create a .feature file. For instance a `login.feature` file that looks like this:

    ```gherkin
    Feature: Login

    I want to login to dashboard
    ![type:video](videos/Feature/login.feature.mp4)
    
    Scenario: Logging into Dashboard
        Given I open the dashboard page
        When I login as "standard_user" user
        Then I should see the dashboard
    ```

6. Create a cypress file named for instance `login.spec.js` that contains this:

    ``` Javascript
    import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

    Given('I open the dashboard page', () => {
        cy.clearViewPortIfCypressIsInDocumentationMode();
        cy.visit('/');
        cy.displayTextIfCypressIsInDocumentationMode('I open the dashboard page');
    });

    When('I login as {string} user', (username) => {
        cy.displayTextIfCypressIsInDocumentationMode('I login as {string} user');
        sessionStorage.setItem('userName', username);
    });

    Then('I should see the dashboard', () => {
        cy.displayTextIfCypressIsInDocumentationMode('I should see the dashboard');
        cy.get('[data-cy=header_dashboard]').should('have.text', 'Dashboard');
    });
    ```

7. Add a `cypress.json` like this:

    ```json
    {
        "baseUrl": "http://localhost:3000/",
        "testFiles": "**/*.{feature,features}",
        "nodeVersion": "system"
    }

    ```

    The testFiles here are important for cypress to find the feature files

8. Add these commands to `commands.js` under the cypress folder
  
    Display textbox if cypress is in documentation mode

    ```Javascript
    Cypress.Commands.add('displayTextIfCypressIsInDocumentationMode', (text) => {
        if (Cypress.env('CYPRESS_IN_DOCUMENTATION_MODE') || process.env.CYPRESS_IN_DOCUMENTATION_MODE) {
            cy.text(text, {
                duration: 4000, // how long the text should be there
                blocking: true, // wait for the text to hide
                textSize: '20pt' // CSS text height
            });
        }
    });
    ```

    Display text on the cypress video

    ```javascript
    const textCommand = (text, options = {}) => {
        if (!text) {
            throw new Error('cy.text expects text');
        }
        if (!Cypress._.isString(text)) {
            throw new Error('cy.text expects a string');
        }

        Cypress._.defaults(options, {
            duration: 2000,
            blocking: false,
            textSize: '40pt'
        });

        const doc = cy.state('document');
        const body = doc.body;

        const textHtml = `
            <div id="text-overlay-1647"
            style="position: fixed; left: 0; right: 0; bottom: 0;
                text-align:center; width: 100%; padding: 4rem 0;
                font-size: ${options.textSize}; color: white;
                background: linear-gradient(to bottom, rgba(100, 100, 100, 0.3) 0%, rgba(10, 10, 10, 0.5) 40%, rgba(10, 10, 10, 0.5) 70%, rgba(80, 80, 80, 0.3) 100%);
                z-index: 999999999;
                ">
            ${text}
            </div>
        `;
        Cypress.$(body).append(textHtml);

        // remove text after "duration" ms
        setTimeout(() => {
            const textElement = doc.getElementById('text-overlay-1647');
            if (textElement) {
                body.removeChild(textElement);
            }
        }, options.duration);

        if (options.blocking) {
            cy.wait(options.duration, { log: false });
        }
    };

    Cypress.Commands.add('text', textCommand);
    ```

9. Validate that the test runs. The steps in the cypress test has to match exactly the text in the feature file
10. If the test runs. Add this file named `cypress.docs.config.ts`:

    ```typescript
    import { defineConfig } from 'cypress';
    import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
    import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
    import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';

    export default defineConfig({
        e2e: {
            specPattern: '**/*.feature',
            baseUrl: 'http://localhost:3000/',
            video: true,
            videoUploadOnPasses: true,
            videoCompression: false,
            env: {
                'cypress-movie': {
                    enabled: true,
                    cursorTracking: {
                        enabled: true,
                        shape: 'dot'
                    },
                    width: 1920,
                    height: 1080
                },
                NO_COMMAND_LOG: 1
            },
            viewportWidth: 1920,
            viewportHeight: 1080,
            async setupNodeEvents(
                on: Cypress.PluginEvents,
                config: Cypress.PluginConfigOptions
            ): Promise<Cypress.PluginConfigOptions> {
                // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
                await addCucumberPreprocessorPlugin(on, config);

                on(
                    'file:preprocessor',
                    createBundler({
                        plugins: [createEsbuildPlugin(config)]
                    })
                );

                // Make sure to return the config object as it might have been modified by the plugin.
                return config;
            }
        }
    });
    ```

    The `video` and `videoUploadOnPasses` are importat to have true for the videos to work

11. Add this script under `.github/scripts` folder. Create the scripts folder. Name the script `DocumentationConverter.ps1`

    ```powershell
    Set-ExecutionPolicy Bypass
    Set-ExecutionPolicy Bypass -Scope Process -Force; iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
    choco install pickles
    pickles --feature-directory=cypress/integration/Feature --documentation-format=MarkDown
    ```

12. Add another script in the same directory named `DocumentationMerger.ps1`

    ```powershell
    Get-Content -Path cypress/integration/Feature/* -Filter *.feature | Set-Content index.md 
    ```

13. Add a github action named `documentation-update.yml`

    ```yml
    name: Update documentation

    on:
        workflow_dispatch:
        schedule:
            - cron: '0 4 * * 1,3,5'

    jobs:
        build:
            name: Update documentation
            runs-on: ubuntu-latest
            steps:
                - name: Checkout Code
                uses: actions/checkout@v2

                - run: npm ci

                - name: run app
                run: npm start & npx wait-on http://localhost:3000
                env:
                    REACT_APP_CYPRESS_IN_DOCUMENTATION_MODE: 1

                - name: Run documentation cypress tests
                run: npx cypress run --config-file "cypress.docs.json" --env CYPRESS_IN_DOCUMENTATION_MODE=1

                - name: Save documentation video
                uses: actions/upload-artifact@v1
                with:
                    name: documentation-videos
                    path: cypress/videos

                - name: Pushes documentation vidoes
                uses: dmnemec/copy_file_to_another_repo_action@main
                env:
                    API_TOKEN_GITHUB: ${{ secrets.PERSONAL_TOKEN }}
                with:
                    source_file: 'cypress/videos'
                    destination_repo: <repo>
                    destination_folder: '/docs/documentation/'
                    user_email: <email>
                    user_name: <username>
                    commit_message: 'docs: update videos'

        create_scenario_docs:
            name: Create scenario docs
            runs-on: windows-latest
            steps:
                - name: Checkout Code
                uses: actions/checkout@v2
                - uses: Amadevus/pwsh-script@v2
                id: my-script4
                with:
                    script: ./.github/scripts/ScenarioDocumentationMerger.ps1

                - run: |
                    ./.github/scripts/DocumentationConverter.ps1
                - run: dir
                - name: Save scenario documentation
                uses: actions/upload-artifact@v1
                with:
                    name: scenarios
                    path: features.md

        upload_scenario_docs:
            needs: create_scenario_docs
            name: Upload scenario docs
            runs-on: ubuntu-latest
            steps:
                - name: Checkout Code
                uses: actions/checkout@v2
                - run: dir
                - uses: actions/download-artifact@v3
                with:
                    name: scenarios
                - run: dir
                - name: Pushes features to docs page
                uses: dmnemec/copy_file_to_another_repo_action@main
                env:
                    API_TOKEN_GITHUB: ${{ secrets.PERSONAL_TOKEN }}
                with:
                    source_file: 'features.md'
                    destination_repo: <repo>
                    destination_folder: '/docs/documentation/'
                    user_email: <email>
                    user_name: <username>
                    commit_message: 'docs: update features'


    ```

    You need to change the `destination_repo`, `user_email`, `user_name` variables. Also you need to add a personal token as a github secret. This you can generate under your github profile under the settings. Search for "personal access token github" on google.
14. On your documentation site. You need [this package](https://pypi.org/project/mkdocs-video/)
        On your `mkdocs.yml` in your documentation site repo. The `plugins` section should look something like this:

    ```yml

    plugins:
    - mkdocs-video:
        is_video: True
        video_autoplay: False
        css_style:
            width: "850px"
            height: "478px"
    - search:
        separator: '[\s]+'
        lang: en
        prebuild_index: true
    - git-revision-date
    ```

    Also in your `Dockerfile` you need to include this

    ```Dockerfile
    RUN pip3 install mkdocs-video
    ```

If you followed every step it should now run smoothly. The documentation is updated monday, wednesday and friday at 4am. You can change that in the descriptions

## Common errors

### Need to approve permissions to Personal access token

If you get this following error. Click on the link and authenticate the token.

