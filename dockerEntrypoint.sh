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

#region certificates
CERT_DIR=/opt/certs

if [ ! -f "$CERT_DIR/cert.crt" ] || [ ! -f "$CERT_DIR/cert.key" ]; then
  echo "Certificate not found, try to generate..."

  if [ -z "$HOSTNAME" ]; then
    echo "HOSTNAME not set, cannot generate certificate"
    exit 1
  fi

  echo "Generating certificate for $HOSTNAME"
  mkdir -p $CERT_DIR
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/cert.key -out $CERT_DIR/cert.crt -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=$HOSTNAME"
  echo "Certificate generated"
fi

screen -dmS listen_for_exception # to create a fallback session, to skip future checks if screen is initialized
screen -wipe
screen -dmS astro bash -c "cd /opt/astroProject && ./updateDaemon.sh"
sleep 10
screen -xr AUTO-astro
