#!/bin/bash
while true

MSG=$(cat <<EOF
{
  "a": "$(( ( RANDOM % 10 ) + 1 ))",
  "b": "$(( ( RANDOM % 20 ) + 1 ))",
  "c": "$(( ( RANDOM % 20 ) + 1 ))",
  "d": "$(( ( RANDOM % 20 ) + 1 ))",
  "e": "$(( ( RANDOM % 20 ) + 1 ))",
  "f": "$(( ( RANDOM % 20 ) + 1 ))",
  "g": "$(( ( RANDOM % 20 ) + 1 ))",
  "h": "$(( ( RANDOM % 20 ) + 1 ))"
}
EOF
)

do

  echo "Sending message: ${MSG}"
  mqtt pub -t '#' -h 'localhost' -m "$MSG"
  sleep 1

done