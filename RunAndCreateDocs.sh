#!/bin/bash

# Read the contents of all .feature files in cra-app/cypress/features/feature1/ and write to index.md
cat cra-app/cypress/features/**/*.feature > index.md

# Set execution policy to bypass
# echo "Bypass" | sudo tee /etc/sudoers.d/execution_policy

# Install Chocolatey
# curl https://community.chocolatey.org/install.ps1 -UseBasicParsing | sudo bash -

# Install pickles using Chocolatey
# sudo choco install pickles

# Generate documentation using pickles
# pickles --feature-directory=cypress/integration/Feature --documentation-format=MarkDown

#!/bin/bash

# check if the index.md file exists in the current directory

# sed -i '1i\ #Features!' index.md


if [ -e "index.md" ]
then
    
    # move the index.md file into the docs folder
    cp index.md docsSite/docs/
    
    echo "index.md moved to docs/"
else
    echo "index.md not found in current directory."
fi


if [ -e "cra-app" ]
then

    # move the index.md file into the docs folder
    cp -R cra-app/featureVideos docsSite/docs/
    
    echo "index.md moved to docs/"
else
    echo "index.md not found in current directory."
fi
