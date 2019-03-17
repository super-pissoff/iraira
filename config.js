const title = "iraira";
const description = "Collect iraira point to organize drink party";

function normalize(url) {
  let protocol = (url.match(/(http|https)\:\/\//) || [])[1];
  if (/\:443$/.test(url)) {
    protocol = protocol || "https";
  } else {
    protocol = "http";
  }
  return protocol + "://" + url.replace(/(\:80|\:443)$/, "");
}

const appHost = process.env.GLOBAL_HOST || "localhost";
const appPort = Number(process.env.GLOBAL_PORT || 3000);
const apiHost = "chaus.now.sh";
const apiPort = Number("443");

module.exports = {
  isDev: process.env.NODE_ENV !== "production",
  host: process.env.HOST || "localhost",
  title: `${title} - ${description}`,
  port: Number(process.env.PORT || 3000),
  origin: normalize(`${appHost}:${appPort}`),
  api: {
    host: apiHost,
    port: apiPort,
    base: normalize(`${apiHost}:${apiPort}`),
    id: process.env.KOIKI_IRAIRA_PARTY_ID
  },
  webhook: {
    url: process.env.IRAIRA_WEBHOOK_URL
  }
};
