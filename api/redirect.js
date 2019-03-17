const config = require("../config");

module.exports = (req, res) => {
  const lang =
    (req.headers["accept-language"] || "")
      .split(",")[0]
      .split("-")[0]
      .split("_")[0] || "en";
  res.writeHead(302, { Location: `${config.origin}/${lang}` });
  res.end();
};
