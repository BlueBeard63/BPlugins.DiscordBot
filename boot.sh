#!/bin/bash

SOURCE_DIR="/discordBotFiles/"
DEST_DIR="/home/container"

SOURCE_FILE="config.template.toml"
DEST_FILE="config.toml"

rsync -av --ignore-existing "$SOURCE_DIR" "$DEST_DIR"

cd '/home/container'

if [ ! -f "$DEST_FILE" ]; then
    echo "$DEST_FILE does not exist. Renaming $SOURCE_FILE to $DEST_FILE."
    mv "$SOURCE_FILE" "$DEST_FILE"
else
    echo "$DEST_FILE already exists. No action taken."
fi

npm install
npm run start