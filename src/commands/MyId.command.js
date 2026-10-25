// @ts-check

const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;
//const WEBAPPURL = process.env.WEBAPPURL;
const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");
const responseTemplate = require("./responseTemplate/responseTemplate");

class MyIdCommand extends Command {
  constructor(bot) {
    super(bot);
  }
  handle() {
    try {
      this.bot.command('myid', (msg) => {
        // const chatId = msg.chat.id;
        const chatId = msg.message.sender.user_id;
        const firstName = msg?.message?.sender?.first_name
          ? msg?.message?.sender?.first_name
          : ", имя отсутствует";
        const userName =  msg?.message?.sender?.last_name
          ?  msg?.message?.sender?.last_name
          : ", имя телеграм отсутствует";

        new ChatHandle(this.bot).logoutChat(chatId);

        // const options = {
        //   reply_markup: {
        //     inline_keyboard: [
        //       [
        //         {
        //           text: 'Оформить заявку',
        //           web_app: { url: WEBAPPURL } // Замените на URL вашего веб-приложения
        //         }
        //       ]
        //     ]
        //   }
        // };

        // this.bot.sendMessage(chatId, `Ваш id ${chatId}`, options);

     
        
        this.bot.api.sendMessageToChat(
          TELEGRAMM_ADMIN_CHAT,
          `Пользователь запросил свой id ${chatId}, имя: ${firstName} , имя Макс ${userName}`
        );
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = MyIdCommand;
