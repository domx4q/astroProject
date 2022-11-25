#!/bin/sh

# check if screen "AUTO-astro" exists
# else create it and send /home/extra_server/private/astroProject/updateServer.sh to it

if screen -list | grep -q "AUTO-astro"; then
  echo "Screen exists"
else
  echo "Screen does not exist"
  # create screen "AUTO-astro" and send /home/extra_server/private/astroProject/updateServer.sh to it
  screen -dmS AUTO-astro cd /home/extra_server/private/astroProject/ && ./updateServer.sh
fi


# while infinite loop
while true; do
  if git diff-index --quiet HEAD --; then
    echo "No changes"
    # check if screen "AUTO-astro" exists
  else
    echo "Changes"
    screen -S AUTO-astro -X stuff "^C"
    screen -S AUTO-astro -X stuff "cd /home/extra_server/private/astroProject"
    screen -S AUTO-astro -X stuff '\n'
    screen -S AUTO-astro -X stuff "updateServer.sh"
    screen -S AUTO-astro -X stuff '\n'
  fi
#  sleep 5 minutes
  sleep 5m
done
