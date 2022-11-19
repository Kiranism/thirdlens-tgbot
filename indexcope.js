const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

bot.start((ctx) => ctx.reply("Welcome to Third Eye Image Finder"));
bot.help((ctx) =>
  ctx.reply("Type Name and The Bot will flood ur chat with relevant images")
);
bot.on("text", (ctx) => {
  ctx.reply("please wait");
  googleSearch(ctx);
});

const googleSearch = (ctx) => {
  const params = {
    device: "desktop",
    engine: "google",
    ijn: "0",
    q: ctx.message.text,
    google_domain: "google.com",
    tbm: "isch",
  };
  try {
    let images = [];
    search.json(params, async (data) => {
      await data.images_results.map((item) => {
        return images.push(item.original);
      });
      for (var i = 0; i < images.length; i++) {
        setInterval(() => {
          ctx.replyWithPhoto(images[i]);
        }, 2000);
        if (i == images.length - 1) {
          //give your condition here
          clearInterval();
        }
      }
    });
  } catch (e) {
    reject(e);
  }
};

bot.launch();
