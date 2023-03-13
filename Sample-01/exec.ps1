docker build -t auth0-angular-sample .
docker run --init -p 4200:4200 -p 3001:3001 -it auth0-angular-sample