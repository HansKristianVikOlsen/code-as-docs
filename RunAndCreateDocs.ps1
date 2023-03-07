cd .\cra-app
npx cypress run
cd ..

Get-ChildItem -Path ".\cra-app\cypress\features\**\*.feature" | Get-Content | Set-Content index.md

if (Test-Path .\index.md) {
    Copy-Item .\index.md .\docsSite\docs\
    Write-Output "index.md moved to docs/"
} else {
    Write-Output "index.md not found in current directory."
}

if (Test-Path .\cra-app) {
    Copy-Item -Recurse .\cra-app\featureVideos .\docsSite\docs\
    Write-Output "featureVideos moved to docs/"
} else {
    Write-Output "cra-app not found in current directory."
}
