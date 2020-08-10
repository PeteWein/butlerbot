/*
Below is all of the necessary code to create a mock Discord environment.
The goal is the create a way to test commands; the main functionality of butlerbot.js is fairly straightforward.
Really the main aspects that will adjust/need testing are the commands themselves as they will be the most dynamic
aspect of this bot and where the majority of errors will occur.

All code was originally sourced from the below link:
https://stackoverflow.com/questions/60916450/jest-testing-discord-bot-commands
*/
const Discord = require('discord.js')

// a counter so that all the ids are unique
let count = 0

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
    })
    this.client.guilds.cache.set(this.id, this)
  }
}

class TextChannel extends Discord.TextChannel {
  constructor(guild) {
    super(guild, {
      id: count++,
      type: 0
    })
    this.client.channels.cache.set(this.id, this)
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
    })
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
    }, channel)
  }
}

const client = new Discord.Client()
const guild = new Guild(client)
const channel = new TextChannel(guild)

// the user that executes the commands
const user = {id: count++, username: 'username', discriminator: '1234'}


// require the commands and bring them in for testing
const ping = require('../src/commands/ping').execute


// Test 1: ping pong
describe('ping', () => {
  it('sends Pong', async () => {
    await ping(new Message('ping', channel, user))
    expect(channel.lastMessage.content).toBe('Pong.');
  })
});
