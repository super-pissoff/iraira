const fetch = require("isomorphic-unfetch");
const config = require("./config");
const parse = require("./helpers/request");
const path = require("path");
const recursive = require("recursive-readdir-sync");
const PropertiesReader = require("properties-reader");
const url = require("url");

const express = require("express");
const app = express();

const i18n = {};
const files = recursive(path.join(__dirname, "./i18n"));
files.map(file => {
  console.log("### loading lang files");
  console.log(file);
  const properties = PropertiesReader(file);
  const lang = path.basename(file, ".properties");
  i18n[lang] = properties.getAllProperties();
});
console.log(i18n);

app.get("/", (req, res) => {
  const lang =
    (req.headers["accept-language"] || "")
      .split(",")[0]
      .split("-")[0]
      .split("_")[0] || "en";
  res.writeHead(302, { Location: `${config.origin}/${lang}` });
  res.end();
});

app.post("/api/help", (req, res) => {
  fetch(config.webhook.url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      "@context": "http://schema.org/extensions",
      "@type": "MessageCard",
      themeColor: "F9204D",
      title: req.body.message,
      text: " ",
      potentialAction: [
        {
          "@type": "OpenUri",
          name: req.body.place,
          targets: [{ os: "default", uri: req.body.uri }]
        }
      ]
    })
  }).then(() => {
    res.json({});
  });
});

app.get("/api/lang", (req, res) => {
  res.json(i18n[req.query.lang || "en"]);
});

module.exports = app;
