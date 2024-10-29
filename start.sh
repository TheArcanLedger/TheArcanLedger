#!/bin/bash

# Kill any process currently running on port 3000
kill -9 $(lsof -t -i:3000) 2> /dev/null

# Start the server
node app.js
