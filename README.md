# C2G1_Backend
A project running a dockerized Node.js backend and MongoDB database for Dell.

## Requirements
- docker

## Getting started

### Clone repository

```shell
git clone https://github.com/leesean5150/C2G1_Backend.git
```

### Setting Up Configuration
Create a new .env file for the server folder using the .env.sample as a template. For email reset link, navigate to Google Account settings, search for app passwords and create a new app. The password is the app password, not email password.

### Run Server
#### First initialisation / Update codebase
```shell
docker compose up --build
```
#### Subsequent runs with no change to codebase
```shell
docker compose up
```

### Unit Testing
```shell
docker-compose exec app /bin/sh
npm test
```

Open [http://localhost:5000](http://localhost:5000) to connect to backend api endpoints.
