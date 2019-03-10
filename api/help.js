const fetch = require("isomorphic-unfetch");
const config = require("../config");

module.exports = (req, res) => {
  let body = [];
  req
    .on("data", chunk => {
      body.push(chunk);
    })
    .on("end", () => {
      body = JSON.parse(Buffer.concat(body).toString());
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
