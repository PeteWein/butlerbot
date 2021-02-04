/* eslint-disable semi */
/* eslint-disable no-undef */

const Discord = require('discord.js');
const axios = require('axios');
const randomPuppy = require('random-puppy');
const fs = require('fs');

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

// Toggling for various log levels in the test
global.console = {
  //log: jest.fn(),           // console.log are ignored in tests
  log: console.log,           // console.log are ignored in tests
  error: jest.fn(),         // console.error also ignored, since we intentionally throw certain errors
  // keep native behavior for other logging method
  warn: console.warn,       
  info: console.info,
  debug: console.debug,
};

// any mocked functions
jest.mock('axios');
jest.mock('random-puppy');

/*
 * Below is all of the necessary code to create a mock Discord environment.
 * The goal is the create a way to test commands; the main functionality of bot.js is fairly straightforward.
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
  /**
   * Below is my implementation of the bulkDelete method
   * !NOTE: A collection in discordjs is an extended map class -- so I treat this as a map
   * It returns a promise -- on success, pass the expected Collection<Snowflake, Message>
   * On failure, I pass an error with my mock error message
   * https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=bulkDelete
   */
  bulkDelete(content) {           
    return new Promise(function(resolve, reject) {
      if((content > 1) && (content < 100)) {
        channel.lastMessage.deleted = true;     // update deleted property for our test delete
        const collection = {
           Snowflake: Date.now(),
           Message: '200'
        }
        resolve(collection);     
      } else {
        const errorObject = {
          msg: 'An error occured',
          error: 'Mock Error'
       }
       reject(errorObject);
      }
    });
  }
  // for any modules that have a start or stop typing method call
  startTyping() {
    return new Promise(function(resolve) {
        resolve();     
    });
  }
  stopTyping() {
    return undefined;
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

/**
 * dynamically read in commands -- we can define the execute as needed
 * this will ensure all commands are considered in the unit testing, even if no tests are written
 * ! please note this does not include the main bot.js file
 * ! it's assumed that all functionality of the main file is correct if all the commands are tested
 * there will also be a separate import for each execute function
 */
const commands = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commands) {
  require(`./../src/commands/${file}`);
}
// correct names and execute functions
const advice = require('../src/commands/advice').execute;
const apology = require('../src/commands/apology').execute;
const cat = require('../src/commands/cat').execute;
const catfact = require('../src/commands/catfact').execute;
const documentation = require('../src/commands/documentation').execute;
const meme = require('../src/commands/meme').execute;
const ping = require('../src/commands/ping').execute;
const prune = require('../src/commands/prune').execute;
const roll = require('../src/commands/roll').execute;

//*Advice**************************************************** */
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
describe('Advice', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(advice(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Apology**************************************************** */
describe('Apology', () => {
  it('should return a message on behalf of sender', async () => {
  await apology(new Message('!apology @Recipient', channel, user));
  expect(channel.lastMessage.content).toEqual(expect.stringContaining('on behalf of <@0>'));  // sender is <@count>
  });
});
//*Cat**************************************************** */
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
describe('Cat', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(cat(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Catfact**************************************************** */
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
describe('Catfact', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(catfact(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Documentation**************************************************** */
describe('Documentation', () => {
  it('sends message with link to github pages', async () => {
    await documentation(new Message('', channel, user));
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('https://petewein.github.io/butlerbot/'));
  })
});

//*Dog**************************************************** */
const dog = require('../src/commands/dog').execute;
describe('Dog', () => {
  it('returns dog image from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        message: 'Sample dog image'
      }
    });    
    await dog(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('Sample dog image');
  });
});
describe('Dog', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(dog(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Joke**************************************************** */
const joke = require('../src/commands/joke').execute;
describe('Joke', () => {
  it('returns Joke from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        joke: 'mock joke',
      }
    });    
    await joke(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('mock joke');
  });
});
describe('Joke', () => {
  it('returns Joke setup and delivery from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        setup: 'mock joke setup',
        delivery: 'mock joke delivery'
      }
    });    
    await joke(new Message('', channel, user));
    expect(channel.lastMessage.content).toBe('mock joke setup\nmock joke delivery');
  });
});
describe('Joke', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(joke(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Meme**************************************************** */
describe('Meme', () => {
  it('returns meme mock API call', async () => {
    randomPuppy.mockResolvedValue({
      data: {
        message: 'Meme'
      }
    });    
    await meme(new Message('', channel, user));
    expect(channel.lastMessage.content.files[0].attachment.data.message).toBe('Meme');
  });
});
describe('Meme', () => {
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(meme(new Message('', channel, user))).toBeUndefined();    
  });
});

//*Ping**************************************************** */
describe('Ping', () => {
  it('sends latency with ms', async () => {
    await ping(new Message('', channel, user));
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('ms'));
  })
});

//*Prune**************************************************** */
describe('Prune', () => {
  it('Match bulk delete to previous message on success', async () => {
    await prune(new Message('', channel, user), [1]);
    expect(channel.lastMessage.deleted).toBe(true);
  })
});

describe('Prune', () => {
  it('Returns error on empty arguments', async () => {
    await prune(new Message('', channel, user), []);
    expect(channel.lastMessage.content.reply.username).toBe('butlerbot');
  })
});

describe('Prune', () => {
  it('Returns error message to channel if value is 0', async () => {
    await prune(new Message('', channel, user), [0]);
    expect(channel.lastMessage.content.content).toBe('you need to input a number between 1 and 99.');
  })
});

describe('Prune', () => {
  it('throws error to console and sends error message to channel', async () => {
    await prune(new Message('', channel, user), [99]);
    expect(channel.lastMessage.content).toBe('there was an error trying to prune messages in this channel!');
  })
});

//*Roll**************************************************** */
describe('Roll', () => {
  it('Returns 1 on a 1d1', async () => {
    await roll(new Message('', channel, user), ['1d1']);      // args need to be passed as an array to reflect how discordjs handles them
    expect(channel.lastMessage.content).toBe('> 1');      // > is the formatting item
  })
});

describe('Roll', () => {
  it('Returns correct result on multiple of same die', async () => {
    await roll(new Message('', channel, user), ['3d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns correct result on multiple dice', async () => {
    await roll(new Message('', channel, user), ['1d1', '+', '1d1']);  
    expect(channel.lastMessage.content).toBe('> 2 = 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns correct result when parsing on +', async () => {
    await roll(new Message('', channel, user), ['1d1+1d1+1d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  })
});

describe('Roll', () => {
  it('Returns correct result when parsing on ,', async () => {
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
