#!/bin/sh

# Git Push mit Token-Authentifizierung im HTTPS URL
GIT_TOKEN=$1
REPO_URL="https://promobot-hub:${GIT_TOKEN}@github.com/promobot-hub/HQ-Dashboard.git"

cd hq-dashboard

git remote set-url origin $REPO_URL

git push -u origin main
