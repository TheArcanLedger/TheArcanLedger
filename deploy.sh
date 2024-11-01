#!/bin/bash

# Define your commit message
commit_message="Update coding to improve UI"

# Stage all changes
git add .

# Commit changes
git commit -m "$commit_message"

# Push to the main branch
git push origin main
