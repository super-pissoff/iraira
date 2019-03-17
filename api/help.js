const fetch = require("isomorphic-unfetch");
const config = require("../config");
const parse = require("../helpers/request");

module.exports = (req, res) => {
  parse({ req }).then(body => {
    fetch(config.webhook.url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "@context": "http://schema.org/extensions",
        "@type": "MessageCard",
        themeColor: "F9204D",
        title: body.message,
        text: " ",
        potentialAction: [
          {
            "@type": "OpenUri",
            name: body.place,
            targets: [{ os: "default", uri: body.uri }]
          }
        ]
      })
    }).then(() => {
      res.write("{}");
      res.end();
    });
  });
};
