const Discord = require('discord.js');
const axios = require('axios');
/*
 * This next step is critical for testing much of the bot's functionality.
 * We need to mock all of our axios requests so that we can:
 * A: ignore any network calls, speeding up our unit testing
 * B: ensure the results are repeatable (a lot of the API calls used return random results)
 * C: Call it all requests within the above discord mock classes
 * For more info: https://dev.to/zaklaughton/the-only-3-steps-you-need-to-mock-an-api-call-in-jest-39mb
 */
jest.mock('axios');

/*
 * Below is all of the necessary code to create a mock Discord environment.
 * The goal is the create a way to test commands; the main functionality of butlerbot.js is fairly straightforward.
 * Really the main aspects that will adjust/need testing are the commands themselves as they will be the most dynamic
 * aspect of this bot and where the majority of errors will occur.
 * All code was originally sourced from the below link:
 * https://stackoverflow.com/questions/60916450/jest-testing-discord-bot-commands
 */
let count = 0;
class Guild extends Discord.Guild {
  constructor(client) {
    super(client, {
      // you don't need all of these but I just put them in to show you all the properties that Discord.js uses
      id: count++,
      name: '',
      icon: null,
      splash: null,
      owner_id: '',
      region: '',
      afk_channel_id: null,
      afk_timeout: 0,
      verification_level: 0,
      default_message_notifications: 0,
      explicit_content_filter: 0,
      roles: [],
      emojis: [],
      features: [],
      mfa_level: 0,
      application_id: null,
      system_channel_id: null
    });
    this.client.guilds.cache.set(this.id, this);
  }
}

class TextChannel extends Discord.TextChannel {
  constructor(guild) {
    super(guild, {
      id: count++,
      type: 0
    });
    this.client.channels.cache.set(this.id, this);
  }

  // you can modify this for other things like attachments and embeds if you need
  send(content) {
    return this.client.actions.MessageCreate.handle({
      id: count++,
      type: 0,
      channel_id: this.id,
      content,
      author: {
        id: 'bot id',
        username: 'bot username',
        discriminator: '1234',
        bot: true
      },
      pinned: false,
      tts: false,
      nonce: '',
      embeds: [],
      attachments: [],
      timestamp: Date.now(),
      edited_timestamp: null,
      mentions: [],
      mention_roles: [],
      mention_everyone: false
    });
  }
}

class Message extends Discord.Message {
  constructor(content, channel, author) {
    super(channel.client, {
      id: count++,
      type: 0,
      channel_id: channel.id,
      content,
      author,
      pinned: false,
      tts: false,
      nonce: '',
      embeds: [],
      attachments: [],
      timestamp: Date.now(),
      edited_timestamp: null,
      mentions: [],
      mention_roles: [],
      mention_everyone: false
    }, channel);
  }
}

// the user that executes the commands
const user = {id: count++, username: 'butlerbot', discriminator: '1234'};

const client = new Discord.Client();
const guild = new Guild(client);
const channel = new TextChannel(guild);



// Test 1: ping pong
const ping = require('../src/commands/ping').execute;
describe('ping', () => {
  it('sends Pong', async () => {
    await ping(new Message('ping', channel, user));
    expect(channel.lastMessage.content).toBe('Pong.');
  })
});

// Test 2: advice API call to ensure it works
const advice = require('../src/commands/advice').execute;
describe('Advice', () => {
  it('returns advice from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        slip: {
          advice: "Mock advice response."
        }
      }
    });    
    await advice(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('Mock advice response.');
  });
});

// Test 3: fail condition in advice api call
describe('Advice Failure', () => {
  it('go through the failures in the advice API call', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await advice(new Message('', channel, user));
    // we will assume the fail state does nothing (it catches the error and sends a message, but we don't care about that as much)
    expect(channel.lastMessage.content).toBe('Mock advice response.');
  });
});
