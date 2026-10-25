// @ts-check

const cacheService = require("../cache/CacheService");
const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");

const { Keyboard } = require("@maxhub/max-bot-api");

class RegisrtationCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.command("registration", (msg) => {
      const chatId = msg.message.sender.user_id;

      // if (msg.chat.type !== 'private') {
      //   this.requestMessage(chatId, `Эта команда доступна только в личных сообщениях. ${chatId}`);
      //   return;
      // }

      // new ChatHandle(this.bot).logoutChat(chatId);

      // const options = {
      //   reply_markup: {
      //     keyboard: [
      //       [
      //         {
      //           text: "Регистрация, НАЖМИТЕ СЮДА 🚨",
      //           request_contact: true,
      //         },
      //       ],
      //     ],
      //     one_time_keyboard: true,
      //   },
      // };    

      const options = {
        attachments: [
          {
            type: "inline_keyboard",
            payload: {
              buttons: [
                [
                  {
                    type: "request_contact",
                    text: "📱 Поделиться контактом",
                  },
                ],
              ],
            },
          },
        ],
      };

      this.requestMessage(
        chatId,
        "Пожалуйста, поделитесь своим номером телефона, НАЖМИТЕ <<Регистрация, нажмите сюда>>:",
        options,
      );

      return;
    });
  }
}

module.exports = RegisrtationCommand;
