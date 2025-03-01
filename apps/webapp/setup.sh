#!/bin/bash

echo "Setting .env file"
cp env.base .env

echo "Setting .env.remote file"
cp env.example .env.remote

echo "" >> .env.remote
echo "" >> .env.remote

echo "What's your POSTGRES_URL_NON_POOLING?"
read nonpooling
echo "POSTGRES_URL_NON_POOLING=\"$nonpooling\"" >> .env.remote

echo "What's your POSTGRES_PRISMA_URL? (\"Pooled Connection\")"
read pooling
echo "POSTGRES_PRISMA_URL=\"$pooling\"" >> .env.remote

echo ""
echo "===== Installing yarn ====="
yarn install

echo ""
echo "===== Installing dotenvx ====="
yarn add dotenvx

echo ""
echo "===== Initializing database schema ====="
dotenvx run -f .env.remote -- yarn prisma migrate dev

echo ""
echo "===== Seeding database ====="
dotenvx run -f .env.remote -- node prisma/seed.js

echo ""
echo "===== Building ====="
yarn build:remote

echo ""
echo "===== DONE ====="
echo "To run the server locally as a production build (faster, no debugging):"
echo "yarn start:remote"
echo "To run the server locally for development (slower, debug):"
echo "yarn dev:remote"