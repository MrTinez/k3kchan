# k3kchan

## Run the bot inside docker (Preferred way)

- Download/Install docker from [here](https://www.docker.com/products/docker-desktop)
- Setup the bot token inside `.env` file.
- A bot with the token you set up previously should already be a member of a discord server.
- From the root folder of the project run `docker-compose up`. This will build the docker image and then run the bot. 
- Wait until you see `Bot is ready! Waiting for commands...`
- Send a message with the command you want to execute. Write `!help` for help.

## Setup your dev environment

- Download/Install docker from [here](https://www.docker.com/products/docker-desktop)
- Download/Install node.js from [here](https://nodejs.org/en/). LTS version should work just fine.
- Execute `npm install`
- Run the bot with `npm start`
- Run linter with `npm run lint`
- Run tests with `npm run test`(Hopefully we'll have tests soon...)