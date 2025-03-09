#!/bin/bash
rm -rf node_modules
npm install --force
npm run build
npm run start