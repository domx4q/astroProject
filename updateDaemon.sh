#!/bin/sh

# check if screen "AUTO-astro" exists
# else create it and send /home/extra_server/private/astroProject/updateServer.sh to it

if screen -list | grep -q "AUTO-astro"; then
  echo "Screen exists"
else
  echo "Screen does not exist"
  # create screen "AUTO-astro" and send /home/extra_server/private/astroProject/updateServer.sh to it
  screen -dmS AUTO-astro
  screen -S AUTO-astro -X stuff $'cd /home/extra_server/private/astroProject\n./updateServer.sh\n'
fi


# while infinite loop
while true; do
  if git diff-index --quiet HEAD --; then
    echo "No changes - " + $(date)
    # check if screen "AUTO-astro" exists
  else
    echo "Changes" -  + $(date)
    screen -S AUTO-astro -X stuff $'^C\ncd /home/extra_server/private/astroProject\n./updateServer.sh\n'
  fi
#  sleep 5 minutes
  echo "Sleeping for 5 minutes"
  sleep 5m
done
