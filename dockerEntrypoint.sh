#!/bin/bash

set -e # Exit on error

#region Install dependencies
apt-get install -y npm
nvm install --lts
nvm use --lts

npm install -g serve
npm install -g @vue/cli

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
#endregion

screen -dmS astro bash -c "cd /opt/astroProject && ./updateDaemon.sh"
sleep 10
screen -xr AUTO-astro
