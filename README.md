# Butlerbot
## A simple discord bot, designed to handle simple tasks.

### Motivation

I felt this would be an enjoyable little experience in creating a bot, as well as using a language/framework I am unfamiliar with. Please feel free to contribute and use as you feel is appropriate!

https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments

https://medium.com/@mason.spr/hosting-a-discord-js-bot-for-free-using-heroku-564c3da2d23f

### How to run locally

From project root, run either of the below commands:

`npm start`
 

`node ./src/butlerbot.js` 

This will start the discord bot from the command line.

### Running from a docker container/image

There is a Dockerfile that can be used to build the bot as well. The main thing here is that, by default, it won't have the bot token required to run (which lives in `.env`). You will need to inject the token into a `.env` file within the container after it is deployed. However, the container itself should work and exposts the default 80/443 ports.

### How to perform unit tests

Currently, there are a few simple unit tests built into the bot. These live in the `test` directory in `test.js`. Currently, jest is used as the testing framework.

Running the tests are fairly straightforward. From the project root, run either of the below commands:

`npm test`

`jest ./test --detectOpenHandles --forceExit`

This will perform all of the unit tests in the test directory.

### How to perform integration tests

Unfortunately I haven't found an "easy" way to do integration testing and confirm everything is working before actually deploying. Right now, I've set up a development and staging discord server, as we as a butlerbot-dev bot (within the discord developer portal). I updated the `.env` when deploying locally to use the dev `BOT_TOKEN`, which allows me to effectively deploy the bot locally and make changes before pushing to github and subsequently the production environment. The development server is focused on making/testing the changes themselves, where the staging is confirming the changes in behavior between the production and development versions of the code.

#### Linting

You can also run linting on the source code, which can assist with silly syntax errors and is useful in the CI/CD pipeline. This can be from the project root with either fo the below commands:

`npm run lint`

`eslint ./src/*`. 

Due to the fact that there is not simple unit testing/mock framework for discord bots, this [link](https://stackoverflow.com/questions/60916450/jest-testing-discord-bot-commands) was the basis for the utility.

### Want butlerbot in your discord?
 
[Here](https://discord.com/api/oauth2/authorize?client_id=740165717688582256&permissions=8&scope=bot) is the invite link that will give Butlerbot the necessary bot permissions.
