
const config = require('config');
const { Telegraf } = require('telegraf')

const BotToken = config.get('botToken')
const ChatId = config.get('botChatId')

const sendMessage = (message) => {
    const bot = new Telegraf(BotToken)
    bot.telegram.sendMessage(ChatId, message)
}

module.exports = { sendMessage }
