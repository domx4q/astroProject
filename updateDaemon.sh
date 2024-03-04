#!/bin/bash

# create the daemon screen if not already created
if screen -list | grep -q "AUTO-astro"; then
  echo "Screen exists"
else
  echo "Screen does not exist"
  screen -dmS AUTO-astro bash
  screen -S AUTO-astro -X stuff $"cd /opt/astroProject\n"
  screen -S AUTO-astro -X stuff $"./updateServer.sh\n"
fi

# this will run forever
while true; do
  git remote update > /dev/null 2>&1

  UPSTREAM=${1:-'@{u}'}
  LOCAL=$(git rev-parse @)
  REMOTE=$(git rev-parse "$UPSTREAM")
  BASE=$(git merge-base @ "$UPSTREAM")

  if [ "$LOCAL" = "$REMOTE" ]; then
    echo "Up-to-date - $(date)"
  elif [ "$LOCAL" = "$BASE" ]; then
    echo "Need to pull - $(date)"
    screen -S AUTO-astro -X stuff $'^C\ncd /opt/astroProject\n./updateServer.sh\n'
  elif [ "$REMOTE" = "$BASE" ]; then
    echo "Need to push - $(date)"
    git reset --hard HEAD
  else
    echo "Diverged - $(date)"
    git reset --hard HEAD
  fi

  echo "Sleeping for 5 minutes"
  sleep 5m
done
