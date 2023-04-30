#!/bin/bash

set -e # Exit on error

#region certificates
CERT_DIR=/opt/certs
export GENERATE_CERT=false

if [ ! -f "$CERT_DIR/cert.crt" ] || [ ! -f "$CERT_DIR/cert.key" ]; then
  echo "Certificate not found, try to generate..."
  # set env = generatet (for global usage)
  export GENERATE_CERT=true
  CERT_DIR=$CERT_DIR/generated

  if [ "$SELFSIGNED" = "true" ]; then
    echo "Generating self-signed certificate"
    mkdir -p $CERT_DIR/selfsigned
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/cert.key -out $CERT_DIR/cert.crt
    echo "Certificate generated"

  else
    if [ -z "$HOSTNAME" ]; then
      echo "HOSTNAME not set, cannot generate certificate"
      exit 1
    fi

    echo "Generating certificate for $HOSTNAME"
    mkdir -p $CERT_DIR
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/cert.key -out $CERT_DIR/cert.crt -subj "/C=DE/CN=$HOSTNAME"
    echo "Certificate generated"
  fi
fi
#endregion

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

function checkScreen {
  screen -ls | grep -q "AUTO-astro"
  if [ $? -eq 0 ]; then
    echo "Screen exists"
    screen -xr AUTO-astro
  else
    echo "Screen does not exist"
    sleep 5
    checkScreen
  fi
}
checkScreen
