//@ts-check

const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");
const responseTemplate = require("./responseTemplate/responseTemplate");

class HelpCommand extends Command {
  constructor(bot) {
    super(bot)
  }
  handle() {
      this.bot.command('help', (msg) => {
        const chatId = msg.message.sender.user_id;
        this.bot.api.sendMessageToUser(chatId, responseTemplate.help);
      });
    }
  }
  
  module.exports = HelpCommand;