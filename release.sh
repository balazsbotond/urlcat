#!/usr/bin/env bash

set -e

npm run build
cp README.md dist/
cp LICENSE dist/
tar cvzf urlcat-$(node -p "require('./package.json').version").tar.gz -C dist .
zip urlcat-$(node -p "require('./package.json').version").zip dist/*
mv ./*.tar.gz dist
mv ./*.zip dist