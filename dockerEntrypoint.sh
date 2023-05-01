#!/bin/bash

 set +e # do not exit on error

#region certificates
CERT_DIR=/opt/certs
export GENERATE_CERT=false

mkdir -p $CERT_DIR
if [ ! -f "/opt/generated.bool" ] && { [ ! -f "$CERT_DIR/cert.crt" ] || [ ! -f "$CERT_DIR/cert.key" ]; }; then
  echo "Certificate not found, try to generate..."
  touch /opt/generated.bool
  export GENERATE_CERT=true
  CERT_DIR=$CERT_DIR/generated
  mkdir -p $CERT_DIR

  if [ "$SELFSIGNED" = "true" ]; then
    echo "Generating self-signed certificate"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/cert.key -out $CERT_DIR/cert.crt -subj "/CN=localhost"
    echo "Certificate generated"

  else
    if [ -z "$HOSTNAME" ]; then
      echo "HOSTNAME not set, cannot generate certificate"
      rm /opt/generated.bool
      exit 1
    fi

    echo "Generating certificate for $HOSTNAME"
    mkdir -p $CERT_DIR
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout $CERT_DIR/cert.key -out $CERT_DIR/cert.crt -subj "/C=DE/CN=$HOSTNAME"
    echo "Certificate generated"
  fi
else
  echo "Certificate found using $CERT_DIR/cert.crt and $CERT_DIR/cert.key"
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
