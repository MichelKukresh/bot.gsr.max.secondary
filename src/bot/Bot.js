// @ts-check

const TelegramBot = require("node-telegram-bot-api");
const { Bot: MaxBot } = require("@maxhub/max-bot-api");
const responseTemplate = require("../commands/responseTemplate/responseTemplate");
const AipUse = require("../utils/api/apiUse");
const Api = require("../utils/api/api");
const SessionRegistration = require("../session/session.registration");
const cacheService = require("../cache/CacheService");
const express = require("express");
const ApiWeb = require("../utils/api/apiWeb");
const port = process.env.EXPRESS_PORT || 8000;

class Bot {
  /**
   * @param {string} token
   */
  constructor(token) {
    // this.bot = new TelegramBot(token, { polling: true });
    this.bot = new MaxBot(token);
    this.bot.start();
  }

  start() {
    try {
      this.bot.on("bot_started", (ctx) => {
        ctx.reply(
          "Добро пожаловать! Используйте команду /start для начала общения.",
        );
      });

      this.bot.command("start", async (msg) => {
        this.bot.api.setMyCommands([
          { name: "/start", description: "Начальное приветствие" },
          { name: "/help", description: "Получить справку" },
          { name: "/order", description: "Оформить заявку" },
          {
            name: "/clear",
            description: "Отменить заполнение заявки/выйти из чатов",
          },
          { name: "/chats", description: "Мои заказы" },
          // { command: "/logoutchat", description: "Выйти из чатов" },
          { name: "/myid", description: "Запросить мой id" },
          { name: "/about", description: "О нас" },
          { name: "/services", description: "Наши услуги" },
          { name: "/menu", description: "Актуальное меню" },
          { name: "/fast", description: "Оформить быструю заявку" },
        ]);     

        const chatId = msg.message.sender.user_id;
        console.log(" ---------- ", msg.message);

        new ApiWeb(this.bot).botCommandStart(chatId);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Bot;
