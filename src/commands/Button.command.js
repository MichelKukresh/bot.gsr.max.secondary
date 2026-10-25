//@ts-check

const LoggerManager = require("../log/LoggerManager");
const Command = require("./command.class");
const ApiWeb = require("../utils/api/apiWeb");
class ButtonsCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    // 0 промо информации

    this.bot.action(/^promo.+$/, async (query) => {
      const commandData = query.callback.payload;
      const valueCommand = commandData.split("_")[1];
      await this.bot.api.deleteMessage(query.message.body.mid);

      new ApiWeb(this.bot).botPromo(
        query.message.recipient.user_id,
        valueCommand,
      );
    });

    // 1 кнопка проверка статуса

    this.bot.action(/^status_.+$/, async (query) => {
      const commandData = query.callback.payload;
      const valueCommand = commandData.split("_")[1];
      new ApiWeb(this.bot).botButtonsOrderStatus(
        query.message.recipient.user_id,
        valueCommand,
      );
    });

    // 2 пропустить остальные поля там где время предлагают

    this.bot.action("fast", async (query) => {
      const commandData = query.callback.payload;
      const valueCommand = commandData.split("_")[1];

      await this.bot.api.deleteMessage(query.message.body.mid);

      new ApiWeb(this.bot).botButtonsOrderFast(
        query.message.recipient.user_id,
        valueCommand,
      );
    });

    // 3 вход в чат
    this.bot.action(/^inchat_.+$/, async (query) => {
      const commandData = query.callback.payload;
      const valueCommand = commandData.split("_")[1];
      new ApiWeb(this.bot).botButtonsChat(
        query.message.recipient.user_id,
        valueCommand,
      );
    });

    // 4 обработка группы кнопок связанных с оформлением заказов
    const actions = [
      "timeWake",
      "fio",
      "city",
      "comment",
      "placeWake",
      "default",
      "dataDeath",
      "dataGoodbyes",
      "fioDeath",
    ];

    const patterns = actions.map((prefix) => new RegExp(`^${prefix}_.+$`));

    this.bot.action(patterns, async (query) => {
      const commandData = query.callback.payload;
      const nameCommand = commandData.split("_")[0];
      const valueCommand = commandData.split("_")[1];
      const valueSecondCommand = commandData.split("_")[2];

      new ApiWeb(this.bot).botMessage(
        query.message.recipient.user_id,
        query.callback.payload,
        query.message.body.mid,
        query.message.body.mid,
      );

      return;
      //this.bot.on("callback_query", async (query) => {
      try {
        console.log(query);

        const commandData = query.data;
        const nameCommand = commandData.split("_")[0];
        const valueCommand = commandData.split("_")[1];
        const valueSecondCommand = commandData.split("_")[2];

        switch (nameCommand) {
          // отработка промо
          case "promo":
            await this.bot.deleteMessage(
              query.message.chat.id,
              query.message.message_id,
            );
            new ApiWeb(this.bot).botPromo(query.from.id, valueCommand);
            break;
          //для работы с отзывами
          case "rewiewApprove":
            new ApiWeb(this.bot).botButtonsReviewApprove(
              query.message.chat.id,
              query.from.id,
              valueCommand,
              valueSecondCommand,
            );

            try {
              if (
                typeof query.message.chat.id === "number" &&
                typeof query.message.message_id === "number"
              ) {
                console.log("Приведены к числу");
                await this.bot.deleteMessage(
                  query.message.chat.id,
                  query.message.message_id,
                );
              } else {
                console.log("Нужно привести к числу");
              }
            } catch (err) {
              console.error(err);
              await this.bot.sendMessage(
                query.message.chat.id,
                "Отзыв отправлен! Нумерция сообщений сбита - кнопки не удалены!",
              );
            }

            console.log(query.message.chat.id, query.message.message_id);

            break;
          // для входа в чат

          // запросить последний статус
          case "diamond2":
            new ApiWeb(this.bot).botButtonsOrderStatus(
              query.from.id,
              query.data,
            );
            break;
          // задать вопрос по заказу
          case "diamond3":
            new ApiWeb(this.bot).botButtonsOrderNumber(
              query.from.id,
              query.data,
            );
            break;
          // задать вопрос по заказу
          case "approve":
            await this.bot.deleteMessage(
              query.message.chat.id,
              query.message.message_id,
            );

            new ApiWeb(this.bot).botButtonsApprove(
              query.from.id,
              valueCommand,
              valueSecondCommand,
            );
            break;

          case "approve-rejection":
            try {
              const encodedText = encodeURIComponent(query.message.text);

              await this.bot.deleteMessage(
                query.message.chat.id,
                query.message.message_id,
              );
              // не отправлять текст отказа
              if (valueSecondCommand == 0) {
                this.bot.sendMessage(
                  query.message.chat.id,
                  "Отказ не отправлен - " + query.message.text,
                );
                return;
              }
              // отправить текст отказа как есть
              if (valueSecondCommand == 1) {
                this.bot.sendMessage(
                  query.message.chat.id,
                  "Отправлен - " + query.message.text,
                );
                this.bot.sendMessage(valueCommand, query.message.text);
                return;
              }

              this.bot.sendMessage(
                query.message.chat.id,
                "Напишите другое сообщение агенту",
                {
                  reply_markup: {
                    keyboard: [
                      [
                        {
                          text: "Написать сообщение",
                          web_app: {
                            url: `https://form-bot.e-funeral.ru/frontend-for-bot/message?tlgId=${valueCommand}&message=${encodedText}`,
                          },
                        },
                      ],
                    ],
                  },
                },
              );
            } catch (err) {
              console.error(err); // Логируем ошибку
            }

            break;
          default:
            console.log("Кнопка не распознана", query.data);
            break;
        }

        return;
      } catch (error) {
        new LoggerManager().logMessage("error", "error", error.message);
      }
    });
  }
}

module.exports = ButtonsCommand;
