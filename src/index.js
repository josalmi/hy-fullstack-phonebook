const express = require("express");
const app = express();

app.get("/api/persons", (req, res, next) => {
  res.json([
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Martti Tienari", number: "040-123456" },
    { id: 3, name: "Arto Järvinen", number: "040-123456" },
    { id: 4, name: "Lea Kutvonen", number: "040-123456" }
  ]);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
