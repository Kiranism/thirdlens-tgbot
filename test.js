const TelegramBot = require("node-telegram-bot-api");
const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "1653aa9359b4b799e1881ad54f927de70a45b444b319e48ad2061578ac3de69c"
);

// replace the value below with the Telegram token you receive from @BotFather
const token = "5644212768:AAEjvtWdUv6ykAmWUIFVZ9NFyjFl4DOInQY";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const params = {
    device: "desktop",
    engine: "google",
    ijn: "0",
    q: message,
    google_domain: "google.com",
    tbm: "isch",
  };

  const callback = function (data) {
    data.images_results.map((item, index) => item.original);
  };

  // Show result as JSON
  search.json(params, callback);
  // send a message to the chat acknowledging receipt of their message

  //   bot.sendMessage(chatId, message);
  bot.send;
});
