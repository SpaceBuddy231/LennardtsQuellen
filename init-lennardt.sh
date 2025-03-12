#!/bin/bash
konsole --new-tab -e bash -c 'cd ~; cd "Schreibtisch/LennardtsQuellen/backend/"; npx @tailwindcss/cli -i ./public/input.css -o ./public/style.css --watch; exec bash' &
konsole --new-tab -e bash -c 'cd ~; cd "Schreibtisch/LennardtsQuellen/backend/"; nodemon server.js; exec bash' &
konsole --new-tab -e bash -c 'cd ~; cd "Schreibtisch/LennardtsQuellen/backend/"; npx @tailwindcss/cli -i ./public/inp_login.css -o ./public/login.css --watch; exec bash' &

