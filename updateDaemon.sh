#!/bin/sh

# create the daemon screen if not already created
if screen -list | grep -q "AUTO-astro"; then
  echo "Screen exists"
else
  echo "Screen does not exist"
  screen -dmS AUTO-astro
  screen -S AUTO-astro -X stuff $'cd /home/extra_server/private/astroProject\n./updateServer.sh\n'
fi

# this will run forever
while true; do
  if git diff-index --quiet HEAD --; then
    echo "No changes - "$(date)
  else
    echo "Changes - "$(date)
    screen -S AUTO-astro -X stuff $'^C\ncd /home/extra_server/private/astroProject\n./updateServer.sh\n'
  fi
  echo "Sleeping for 5 minutes"
  sleep 5m
done
