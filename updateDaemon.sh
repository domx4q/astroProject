#!/bin/sh

# while infinite loop
while true; do
  if git diff-index --quiet HEAD --; then
    ./startServer.sh
  else
    ./updateServer.sh
  fi
#  sleep 5 minutes
  sleep 5m
done
