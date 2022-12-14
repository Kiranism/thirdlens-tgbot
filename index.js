const { Telegraf } = require("telegraf");
require("dotenv").config();
const util = require("util");
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);
const API_TOKEN = process.env.TELEGRAM_TOKEN || "";
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://thirdeyebot.herokuapp.com/";

const bot = new Telegraf(API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

bot.start((ctx) => ctx.reply("Welcome to Third Eye Image Finder"));
bot.help((ctx) =>
  ctx.reply("Type Name and The Bot will flood ur chat with relevant images")
);
bot.on("message", async (ctx) => {
  let query = ctx.message.text;
  if (typeof query === "string" && query.trim().length > 0) {
    const params = {
      device: "desktop",
      engine: "google",
      ijn: "0",
      q: query,
      google_domain: "google.com",
      tbm: "isch",
    };

    // create a callback
    callback = async (data) => {
      console.log(data);
      const image = await data.images_results.map(
        (item, index) => item.original
      );
      ctx.sendChatAction("upload_document");
      var myStringArray = image;
      var arrayLength = myStringArray.length;
      for (var i = 0; i < arrayLength; i++) {
        console.log(myStringArray[i]);
        try {
          await ctx.replyWithPhoto(myStringArray[i]);
        } catch (error) {
          console.log("error", error);
          ctx.reply("error sending image");
        }
      }
    };

    // Show result as JSON
    search.json(params, callback);
  } else {
    console.log("query is empty");
  }
});

// inline query

bot.on("inline_query", async (ctx) => {
  try {
    let query = ctx.inlineQuery.query;

    if (typeof query === "string" && query.trim().length === 0) {
      console.log("query is empty");
    } else {
      const params = {
        device: "desktop",
        engine: "google",
        ijn: "0",
        q: query ? query : "",
        google_domain: "google.com",
        tbm: "isch",
      };

      callback = async (data) => {
        console.log(data);
        const image = await data.images_results
          .slice(0, 49)
          .map((item, index) => {
            return {
              type: "photo",
              id: String(index),
              photo_url: item.original,
              thumb_url: item.thumbnail,
              photo_width: 300,
              photo_height: 200,
            };
          });
        try {
          await ctx.answerInlineQuery(image);
        } catch (error) {
          console.log(error, "Try again");
        }
      };

      search.json(params, await callback);
    }
  } catch (error) {
    console.log(error);
  }
});

bot.launch();
