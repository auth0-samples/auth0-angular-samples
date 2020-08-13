#!/usr/bin/env bash
docker build -t auth0-angular-sample .
docker run --init -p 4200:4200 -it auth0-angular-sample
