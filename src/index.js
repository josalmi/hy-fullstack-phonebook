const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
