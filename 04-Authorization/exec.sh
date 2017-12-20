#!/usr/bin/env bash
docker build -t auth0-angular2-04-authorization .
docker run --env-file .env -p 3000:3000 -p 3001:3001 -it auth0-angular2-04-authorization
