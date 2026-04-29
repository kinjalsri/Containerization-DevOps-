const http = require("http");

const PORT = process.env.PORT || 3000;
const MESSAGE = process.env.MESSAGE || "Default Message";

http.createServer((req, res) => {
  res.end(`Message: ${MESSAGE}`);
}).listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});