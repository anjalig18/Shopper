#!/bin/bash
# Deploy fix script

echo "Adding changed files..."
git add server/routes/order.js server/routes/admin.js

echo "Committing changes..."
git commit -m "Fix Express 5 route order conflicts in order.js and admin.js"

echo "Pushing to GitHub..."
git push

echo "Done! Your deployment should automatically restart with the fixes."
