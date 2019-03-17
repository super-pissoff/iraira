module.exports = function parse({ req }) {
  const body = [];
  return new Promise(resolve => {
    req
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        resolve(JSON.parse(Buffer.concat(body).toString()));
      });
  });
};
