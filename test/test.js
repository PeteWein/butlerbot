/* eslint-disable semi */
/* eslint-disable no-undef */

const Discord = require('discord.js');
const axios = require('axios');
/*
 * This next steps are critical for testing much of the bot's functionality.
 * We need to mock all of our axios requests so that we can:
 * A: ignore any network calls, speeding up our unit testing
 * B: ensure the results are repeatable (a lot of the API calls used return random results)
 * C: Call it all requests within the above discord mock classes
 * D: Remove our mock errors from the console for clarity
 * For more info: https://dev.to/zaklaughton/the-only-3-steps-you-need-to-mock-an-api-call-in-jest-39mb
 * For disabling console.log info: https://stackoverflow.com/questions/44467657/jest-better-way-to-disable-console-inside-unit-tests
 */
jest.mock('axios');
//jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());

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


// advice API call to ensure it works
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

// fail condition in advice api call
describe('Advice', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(advice(new Message('', channel, user))).toBeUndefined();    
  });
});

// check apology command
const apology = require('../src/commands/apology').execute;
describe('Apology', () => {
  it('should return a message on behalf of sender', async () => {
  await apology(new Message('!apology @Recipient', channel, user));
  expect(channel.lastMessage.content).toEqual(expect.stringContaining('on behalf of <@0>'));  // sender is <@count>
  });
});

// cat API call to ensure it works
const cat = require('../src/commands/cat').execute;
describe('Cat', () => {
  it('returns cat from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: [{
        url: 'https://sample_url.com'
        }
      ]
    });    
    await cat(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('https://sample_url.com');
  });
});

// fail condition in cat api call
describe('Cat', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(cat(new Message('', channel, user))).toBeUndefined();    
  });
});

// catfact API call to ensure it works
const catfact = require('../src/commands/catfact').execute;
describe('Catfact', () => {
  it('returns cat fact from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        text: 'Sample cat fact'
      }
    });    
    await catfact(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('Sample cat fact');
  });
});

// fail condition in cat api call
describe('Catfact', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(catfact(new Message('', channel, user))).toBeUndefined();    
  });
});

// documentation
const documentation = require('../src/commands/documentation').execute;
describe('Documentation', () => {
  it('sends message with link to github pages', async () => {
    await documentation(new Message('', channel, user));
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('https://petewein.github.io/butlerbot/'));
  })
});

// dog API call to ensure it works
const dog = require('../src/commands/dog').execute;
describe('Dog', () => {
  it('returns cat fact from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        message: 'Sample dog image'
      }
    });    
    await dog(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('Sample dog image');
  });
});

// fail condition in cat api call
describe('Dog', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(dog(new Message('', channel, user))).toBeUndefined();    
  });
});

// ping pong
const ping = require('../src/commands/ping').execute;
describe('Ping', () => {
  it('sends latency with ms', async () => {
    await ping(new Message('', channel, user));
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('ms'));
  })
});

// roll
const roll = require('../src/commands/roll').execute;
describe('Roll', () => {
  it('Returns 1 on a 1d1', async () => {
    await roll(new Message('', channel, user), ['1d1']);      // args need to be passed as an array to reflect how discordjs handles them
    expect(channel.lastMessage.content).toBe('> 1');      // > is the formatting item
  })
});

describe('Roll', () => {
  it('Returns 3 = 1 + 1 + 1 on a 3d1', async () => {
    await roll(new Message('', channel, user), ['3d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns 2 = 1 + 1 on a 1d1 + 1d1', async () => {
    await roll(new Message('', channel, user), ['1d1 + 1d1']);  
    expect(channel.lastMessage.content).toBe('> 2 = 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns correct result and parses on +', async () => {
    await roll(new Message('', channel, user), ['1d1+1d1+1d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns correct result and parses on ,', async () => {
    await roll(new Message('', channel, user), ['1d1,1d1']);  
    expect(channel.lastMessage.content).toBe('> 2 = 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns usage instructions', async () => {
    await roll(new Message('', channel, user));  
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('The correct usage looks like'));  
  })
});

