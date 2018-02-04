const express = require("express");
const app = express();

app.set("view engine", "pug");

const persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Martti Tienari", number: "040-123456" },
  { id: 3, name: "Arto Järvinen", number: "040-123456" },
  { id: 4, name: "Lea Kutvonen", number: "040-123456" }
];

app.get("/info", (req, res, next) => {
  res.render("info", { persons, date: new Date() });
});

app.get("/api/persons", (req, res, next) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res, next) => {
  const person = persons.find(person => person.id === Number(req.params.id));
  res.json(person);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
