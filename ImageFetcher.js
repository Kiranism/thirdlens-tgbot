const SerpApi = require("google-search-results-nodejs");
const search = new SerpApi.GoogleSearch(
  "1653aa9359b4b799e1881ad54f927de70a45b444b319e48ad2061578ac3de69c"
);

const params = {
  device: "desktop",
  engine: "google",
  ijn: "0",
  q: "sunny",
  google_domain: "google.com",
  tbm: "isch",
};

const callback = function (data) {
  console.log(data.images_results.map((item, index) => item.original));
};

// Show result as JSON
search.json(params, callback);
