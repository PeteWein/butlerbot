# Butlerbot
## A simple discord bot, designed to handle simple tasks.

![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![CodeQL](https://github.com/PeteWein/butlerbot/workflows/CodeQL/badge.svg?branch=master)
![Last Commit](https://img.shields.io/github/last-commit/PeteWein/butlerbot)

![Node.js CI](https://github.com/PeteWein/butlerbot/workflows/Node.js%20CI/badge.svg?branch=master)
![Docker Image CI](https://github.com/PeteWein/butlerbot/workflows/Docker%20Image%20CI/badge.svg?branch=master)

### Introduction

Are you tired of insulting your fellow discord server members? Are you annoyed at continuously having to apologize to them? Do you want advice that may or may not be relevant to your situation? Say no more -- Butlerbot is here to help serve you in your more banal of tasks! From grabbing cute pictures of cats or dogs to telling a silly joke and breaking the ice, butlerbot is here to serve!

### How to run locally

First, you will need to create a new discord bot application in the [Discord developer portal](https://discord.com/developers/applications), which will be used to connect the discord bot that users interact with to the underlying code. Once created, you will need the `Client Secret` value (hidden in the UI by default) to inject into the discord bot. Next, you will need to create a `.env` file* in the project root with `BOT_TOKEN=YOUR_SECRET` in the file.

From the project root, run any of the below commands. There is a standard `npm start` command, which is identical to a standard deployment run; there is also a `npm run local-dev` option, which will automatically reload the application on any code changes. This is the recommended approach for local development, as it will greatly speed up development by eliminating the need to stop and restart the application during the process.

```
# (recommended) Start discord bot in local development mode
npm run local-dev

# the underlying node cli command
nodemon ./src/butlerbot.js

# Start discord bot using the same method as a standard deployment
npm start
# underlying npm command
node ./src/butlerbot.js
```
 This will start the discord bot from the command line.

**NOTE: there is a `.env.example` file to assist with the variable name/format.*

### Running from a docker container/image

There is a Dockerfile that can be used to build the bot as well. The main thing here is that, by default, it won't have the bot token required to run (which lives in `.env`). You will need to inject the token into a `.env` file within the container after it is deployed. However, the container itself should work and exposts the default 80/443 ports.

### Linting

You can also run linting on the source code, which can assist with syntax errors/code style enforcement and is useful in the CI/CD pipeline. This can be from the project root with either fo the below commands:

```
npm run lint

eslint ./src/*.js ./src/commands/*.js
```

### Unit Tests

There are a few unit tests built into the bot. These live in the `test` directory in `test.js`. Although there is not 100% code coverage, the tests do cover a range of bot functionality aspects and flows. For the commands that do have unit tests, there is 100% code coverage. Currently, jest is used as the testing framework.

Running the tests are fairly straightforward. From the project root, run either of the below commands:

```
# easy npm usage
npm test

# full jest cli option
jest ./test --detectOpenHandles --forceExit --coverage --runInBand
```
In addition to performing all of the unit tests, this test suite will also produce a coverage directory that reports the results of the test. These can be found in the `coverage/` directory at the project root. You can also view a report visualization at `file:///<PATH>/<TO>/<REPO>/butlerbot/coverage/lcov-report/index.html`.

Due to the fact that there is no simple unit testing/mock framework for discord bots, this [stackoverflow answer](https://stackoverflow.com/questions/60916450/jest-testing-discord-bot-commands) was the basis for the unit testing.

### Integration Tests

Unfortunately I haven't found an "easy" way to do integration testing and confirm everything is working before actually deploying. Right now, I've set up a development and staging discord server, as well as a butlerbot-dev bot (within the [discord developer portal](https://discord.com/developers/applications), similar to when the bot is first created). I updated the `.env` when deploying locally to use the dev `BOT_TOKEN`, which allows me to deploy the bot locally and make changes before pushing to github and subsequently the production environment. The development server is focused on making/testing the changes themselves, where the staging is confirming the changes in behavior between the production and development versions of the code.


### External Documentation

If you are looking to create your own discord bot, below are the guides I found useful:

https://discordjs.guide/

https://medium.com/@mason.spr/hosting-a-discord-js-bot-for-free-using-heroku-564c3da2d23f

### Want butlerbot in your discord?
 
[Here](https://discord.com/api/oauth2/authorize?client_id=740165717688582256&permissions=8&scope=bot) is the invite link that will give Butlerbot the necessary bot permissions.

Alternatively, please feel free to visit Butlerbot's [homepage](https://petewein.github.io/butlerbot/) or [top.gg](https://top.gg/bot/740165717688582256) page.
