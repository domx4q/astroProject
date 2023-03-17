#!/bin/bash

set -e # Exit on error

#region Install dependencies
. ~/.nvm/nvm.sh && nvm install --lts

apt-get install -y npm
nvm install --lts
nvm use --lts

npm install -g serve
npm install -g @vue/cli

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
#endregion

screen -dmS listen_for_exception # to create a fallback session, to skip future checks if screen is initialized
screen -wipe
screen -dmS astro bash -c "cd /opt/astroProject && ./updateDaemon.sh"
sleep 10
screen -xr AUTO-astro
