#!/bin/bash

ROOTDIR=$(pwd)
EXIT_VAL=0
echo "$PWD"
for d in ./services/*; do
  cd "$d"
  if ! npx eslint ./ --max-warnings 0; then
    ((EXIT_VAL++))
  fi
  cd "$ROOTDIR"
done

if [[ "$EXIT_VAL" -gt 0 ]]; then
  exit 1
fi

exit 0