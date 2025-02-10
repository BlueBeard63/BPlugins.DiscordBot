#!/bin/bash

SOURCE_DIR="/discordBotFiles/"
DEST_DIR="/home/container"

rsync -av --ignore-existing "$SOURCE_DIR" "$DEST_DIR"

cd '/home/container'
cp config.template.toml config.toml

npm install
npm run start