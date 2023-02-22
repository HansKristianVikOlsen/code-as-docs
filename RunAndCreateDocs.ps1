Get-Content -Path cra-app/cypress/features/feature1/* -Filter *.feature | Set-Content index.md 

Set-ExecutionPolicy Bypass
Set-ExecutionPolicy Bypass -Scope Process -Force; iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
choco install pickles
pickles --feature-directory=cypress/integration/Feature --documentation-format=MarkDown