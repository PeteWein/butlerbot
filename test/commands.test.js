/* eslint-disable semi */
/* eslint-disable no-undef */

// any mocked functions
jest.mock('axios');
jest.mock('random-puppy');

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
  log: jest.fn(),           // console.log are ignored in tests
  error: jest.fn(),         // console.error also ignored, since we intentionally throw certain errors
  // keep native behavior for other logging method
  warn: console.warn,       
  info: console.info,
  debug: console.debug,
};

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
    if (content === "!memeit") {
      return this.client.actions.MessageCreate.handle({
        id: count++,
        type: 0,
        channel_id: this.id,
        content,
        author: {
          id: 'Butlerbot_ID',
          username: 'Butlerbot_Username',
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
        mention_everyone: false,
        reference: {
          channelId: this.id,
          guildId: this.guildId,
          messageId: 1
        }
      });
    }
    else {
      return this.client.actions.MessageCreate.handle({
        id: count++,
        type: 0,
        channel_id: this.id,
        content,
        author: {
          id: 'Butlerbot_ID',
          username: 'Butlerbot_Username',
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
        mention_everyone: false,
      });
    }
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
    return;
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
client.commands = new Discord.Collection();

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
	const command = require(`../src/commands/${file}`);  
  client.commands.set(command.name, command);
}

// correct names and execute functions
const advice = require('../src/commands/advice').execute;
const apology = require('../src/commands/apology').execute;
const cat = require('../src/commands/cat').execute;
const catfact = require('../src/commands/catfact').execute;
const documentation = require('../src/commands/documentation').execute;
const dog = require('../src/commands/dog').execute;
const help = require('../src/commands/help').execute;
const insult = require('../src/commands/insult').execute;
const introduce = require('../src/commands/introduce').execute;
const joke = require('../src/commands/joke').execute;
const meme = require('../src/commands/meme').execute;
const ping = require('../src/commands/ping').execute;
const prune = require('../src/commands/prune').execute;
const roll = require('../src/commands/roll').execute;
const memeit = require('../src/commands/memeit').execute;

beforeEach(() => {
  jest.resetModules()
});

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
  it('returns nothing on failure', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error'));    
    await expect(dog(new Message('', channel, user))).toBeUndefined();    
  });  
});

//*Help**************************************************** */
describe('Help', () => {
  it('sends message with info', async () => {
    await help(new Message('', channel, user), []);
    expect(channel.lastMessage.content[0]).toEqual(expect.stringContaining('Here\'s a list of all my commands'));
  });
  it('sends command specific info', async () => {
    await help(new Message('', channel, user), ['help']);
    expect(channel.lastMessage.content[0]).toEqual(expect.stringContaining('**Name:**'));
    expect(channel.lastMessage.content[4]).toEqual(expect.stringContaining('**Cooldown:**'));
  });
  it('includes default timeout', async () => {
    await help(new Message('', channel, user), ['apology']);
    expect(channel.lastMessage.content[4]).toBe('**Cooldown:** 3 second(s)');
  });
  it('handle error on bad command', async () => {
    await help(new Message('', channel, user), ['invalid-command']);
    expect(channel.lastMessage.content.content).toBe('that\'s not a valid command!');
  });
});

//*introduce**************************************************** */
describe('Introduce', () => {
  it('introduce channel cache prep', async () => {
    axios.get.mockResolvedValue({
      data: {
        titles: ['title'],
        aliases: [],
        value: {
          joke: 'joke'
        }
      }
    });  
    await introduce(new Message('', channel, user), []);
  });
  it('introduces a member to the channel', async () => {
    axios.get.mockResolvedValue({
      data: {
        titles: ['title'],
        aliases: [],
        value: {
          joke: 'joke'
        }
      }
    });  
    await introduce(new Message('', channel, user), []);
    expect(channel.lastMessage.content).toBe('@here Announcing the arrival of title <@0>!\njoke');
  });
  it('clear cache', async () => {
    axios.get.mockResolvedValue({
      data: {
        titles: [undefined],
        aliases: [],
        value: {
          joke: 'joke'
        }
      }
    });  
    await introduce(new Message('', channel, user), ['']);
  });
  it('choose default title', async () => {
    axios.get.mockResolvedValue({
      data: {
        titles: [undefined],
        aliases: [],
        value: {
          joke: 'joke'
        }
      }
    });  
    await introduce(new Message('', channel, user), ['']);
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('Master'));
  });
  it('clear cache', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error')); 
    await introduce(new Message('', channel, user), ['']);
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('Master'));
  });
  it('gracefully handle error', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error')); 
    await introduce(new Message('', channel, user), ['']);
    expect(channel.lastMessage.content).toBe('I\'m unable properly introduce at this time, sorry master <@0>');
  });  
});

//*Insult**************************************************** */
describe('Insult', () => {
  it('returns insult from mock API call', async () => {
    axios.get.mockResolvedValue({
      data: {
        insult: 'mock insult',
      }
    });    
    await insult(new Message('', channel, user), ['target']);
    expect(channel.lastMessage.content).toBe('target, mock insult');
  });
  it('returns nothing on failure', async () => {
    await insult(new Message('', channel, user), []);         // same results as previous message since it failed
    expect(channel.lastMessage.content).toBe('target, mock insult');    
  });
  it('returns error chat if data changes', async () => {
    axios.get.mockRejectedValue(new Error('Mock Error')); 
    await insult(new Message('', channel, user), ['target']);
    expect(channel.lastMessage.content).toBe('I am unable to pity the fool, sorry master <@0>');
  });
});

//*Joke**************************************************** */
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
  });
  it('Returns error on empty arguments', async () => {
    await prune(new Message('', channel, user), []);
    expect(channel.lastMessage.content.reply.username).toBe('butlerbot');
  });
  it('Returns error message to channel if value is 0', async () => {
    await prune(new Message('', channel, user), [0]);
    expect(channel.lastMessage.content.content).toBe('you need to input a number between 1 and 99.');
  });
  it('throws error to console and sends error message to channel', async () => {
    await prune(new Message('', channel, user), [99]);
    expect(channel.lastMessage.content).toBe('there was an error trying to prune messages in this channel!');
  });
});

//*Roll**************************************************** */
describe('Roll', () => {
  it('Returns 1 on a 1d1', async () => {
    await roll(new Message('', channel, user), ['1d1']);      // args need to be passed as an array to reflect how discordjs handles them
    expect(channel.lastMessage.content).toBe('> 1');      // > is the formatting item
  });
  it('Returns correct result on multiple of same die', async () => {
    await roll(new Message('', channel, user), ['3d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  });
  it('Returns correct result on multiple dice', async () => {
    await roll(new Message('', channel, user), ['1d1', '+', '1d1']);  
    expect(channel.lastMessage.content).toBe('> 2 = 1 + 1');
  });
  it('Returns correct result when parsing on +', async () => {
    await roll(new Message('', channel, user), ['1d1+1d1+1d1']);  
    expect(channel.lastMessage.content).toBe('> 3 = 1 + 1 + 1');
  });
  it('Returns correct result when parsing on ,', async () => {
    await roll(new Message('', channel, user), ['1d1,1d1']);  
    expect(channel.lastMessage.content).toBe('> 2 = 1 + 1');
  });
  it('Returns usage instructions', async () => {
    await roll(new Message('', channel, user));  
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('The correct usage looks like'));  
  });
});

//*Memeit**************************************************** */
describe('Memeit', () => {
  it('returns a custom made meme on success', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          memes: [{
            "id": "1",
            "name": "Test Meme",
            "url": "https://fakememe.jpg",
            "width": 100,
            "height": 100,
            "box_count": 1            
          }]
        }
      }
    });
    axios.post.mockResolvedValue({
      data: {
        data: {
          url: "https://fakeMemeResponse.jpg"
        }
      }
    });
    await memeit(new Message('', channel, user), []);      
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('The correct usage looks like'))  // the memeit command should use the previous message
  });
  it('returns a custom made meme on success (reply)', async () => {
    await memeit(new Message('', channel, user));      
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('The correct usage looks like')) 
  });
  it('returns failure for no boxes on meme', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          memes: [{
            "id": "1",
            "name": "Test Meme",
            "url": "https://fakememe.jpg",
            "width": 100,
            "height": 100,
            "box_count": 0           
          }]
        }
      }
    });
    await memeit(new Message('', channel, user));      
    expect(channel.lastMessage.content).toEqual(expect.stringContaining('The correct usage looks like'))
  });
});
