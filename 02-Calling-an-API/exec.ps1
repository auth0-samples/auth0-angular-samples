#!/usr/bin/env bash
docker build -t auth0-angular-02-api .
docker run --init -p 3000:3000 -it auth0-angular-02-api
