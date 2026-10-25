// errorLog.json

const LoggerManager = require("../log/LoggerManager");
const Command = require("./command.class");
const ApiWeb = require("../utils/api/apiWeb");

class FormCommand extends Command {
  constructor(bot) {
    super(bot);
  }
  handle() {
    this.bot.on("message_created", async (msg) => {
      try {
       //  console.log("- -- простое сообщение --", msg);

        // new LoggerManager().logMessage("log", "bot.on(message)", msg);
        const chatId = msg.message.sender.user_id;
        //  await this.bot.api.sendMessageToUser(chatId, 'Какое то сообщение' );
        // поиск команды на регистрацию

        ///////////////
        // Проверяем наличие вложений в данном слкчае для регистрации
        if (msg.message?.body?.attachments) {
          console.log(
            "Получены вложения:",
            JSON.stringify(msg.message.body.attachments, null, 2),
          );

          // Ищем контакт
          const contactAttachment = msg.message.body.attachments.find(
            (att) => att.type === "contact",
          );

          if (contactAttachment) {
            const contact = contactAttachment.payload;

            // Извлекаем данные из VCF
            const vcfData = contact.vcf_info;
            const phoneMatch = vcfData.match(/TEL[^:]*:([^\r\n]+)/);
            const nameMatch = vcfData.match(/FN:([^\r\n]+)/);

            const phoneNumber = phoneMatch ? phoneMatch[1] : null;
            const contactName = nameMatch ? nameMatch[1] : null;          

            this.bot.api.sendMessageToUser(
              chatId,
              `Ваш номер телефона: ${phoneNumber} , ${chatId}`,
            );

            new ApiWeb(this.bot).botContact(chatId, phoneNumber);

            return; // Важно: прекращаем дальнейшую обработку
          }
        }        

        ///////////

        if (msg.text === "/start") {
          return;
        }
        if (msg.text === "/help") {
          return;
        }

        if (msg.text === "/registration") {
          return;
        }

        if (msg.text === "/order") {
          return;
        }

        if (msg.text === "/clear") {
          return;
        }
        if (msg.text === "/chats") {
          return;
        }

        if (msg.text === "/logoutchat") {
          return;
        }

        if (msg.text === "/myid") {
          return;
        }

        if (msg.text === "/cleancache") {
          return;
        }

        if (msg.text === "/about") {
          return;
        }

        if (msg.text === "/services") {
          return;
        }

        if (msg.text === "/menu") {
          return;
        }

        if (msg.text === "/fast") {
          return;
        }

        const dataFromWebApp = msg?.web_app_data?.data;

        if (dataFromWebApp) {
          try {
            const parsedData = JSON.parse(dataFromWebApp);

            await this.bot.sendMessage(
              chatId,
              `Вы отправили сообщение: ${parsedData.comment}`,
            );

            await this.bot.sendMessage(
              parsedData.tlgId,
              `Сообщение от куратора: ${parsedData.comment}`,
            );
          } catch (err) {
            await this.bot.sendMessage(
              chatId,
              "Ошибка чтения данных из Web App.",
            );
          }

          return;
        }


      //   console.log("- -- простое сообщение --", msg.message.body.text);

         console.log("msg.message_id", msg.message.body)

       //  return;

        if (!msg.message?.body?.text) {
          return;
        }

        console.log("msg.message?.body?.text", msg.message?.body?.text)

          console.log(
          "msg.message.body.mid",
          msg.message.body.mid);

         

        new ApiWeb(this.bot).botMessage(
          chatId,
          msg.message?.body?.text,
          msg.message.body.mid,
          msg.message.body.mid
        );
        return;
      } catch (error) {
        new LoggerManager().logMessage("error", "error", error.message);
        console.log(error);
      }
    });
  }
}

module.exports = FormCommand;
