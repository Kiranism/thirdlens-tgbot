const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_KEY);

bot.start((ctx) => ctx.reply("Welcome to Third Eye Image Finder"));
bot.help((ctx) =>
  ctx.reply("Type Name and The Bot will flood ur chat with relevant images")
);
// bot.on("sticker", (ctx) => ctx.reply("👍"));
// bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.on("text", async (ctx) => {
  const params = {
    device: "desktop",
    engine: "google",
    ijn: "0",
    q: ctx.message.text,
    google_domain: "google.com",
    tbm: "isch",
  };
  console.log(ctx.message);
  const callback = async function (data) {
    try {
      const image = await data.images_results.map(
        (item, index) => item.original
      );

      console.log(image[0]);
      // ctx.sendChatAction("upload_photo");

      ctx.sendChatAction("upload_document");
      // ctx.replyWithPhoto(image[0]);
      var myStringArray = image;
      var arrayLength = myStringArray.length;
      for (var i = 0; i < arrayLength; i++) {
        console.log(myStringArray[i]);
        ctx.replyWithPhoto(myStringArray[i]);
        //Do something
      }
    } catch (error) {
      console.log("error", error);
      ctx.reply("error sending image");
    }
  };

  // Show result as JSON
  search.json(params, callback);
  // send a message to the chat acknowledging receipt of their message
});
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
