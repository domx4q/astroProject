#!/bin/bash

set -e # Exit on error

#region Install dependencies
apt-get update
apt-get install -y npm
npm install -g serve

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
#endregion

bash ./updateDaemon.sh
