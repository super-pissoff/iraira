const path = require("path");
const recursive = require("recursive-readdir-sync");
const PropertiesReader = require("properties-reader");
const url = require("url");

const i18n = {};
const files = recursive(path.join(__dirname, "../i18n"));
files.map(file => {
  console.log("### loading lang files");
  console.log(file);
  const properties = PropertiesReader(file);
  const lang = path.basename(file, ".properties");
  i18n[lang] = properties.getAllProperties();
});
console.log(i18n);

module.exports = (req, res) => {
  const { query = {} } = url.parse(req.url, true);
  res.write(JSON.stringify(i18n[query.lang || "en"]));
  res.end();
};
