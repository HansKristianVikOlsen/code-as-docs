cd cra-app
npx cypress run
cd ..

cat cra-app/cypress/features/**/*.feature > index.md


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

cd docsSite
mkdocs serve