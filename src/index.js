const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const app = express();

app.set("view engine", "pug");

app.use(bodyParser.json());

const persons = {
  1: { id: 1, name: "Arto Hellas", number: "040-123456" },
  2: { id: 2, name: "Martti Tienari", number: "040-123456" },
  3: { id: 3, name: "Arto Järvinen", number: "040-123456" },
  4: { id: 4, name: "Lea Kutvonen", number: "040-123456" }
};

app.get("/info", (req, res, next) => {
  res.render("info", { persons: Object.values(persons), date: new Date() });
});

app.get("/api/persons", (req, res, next) => {
  res.json(Object.values(persons));
});

app.post("/api/persons", (req, res, next) => {
  const id = Math.floor(Math.random() * 1000000);
  persons[id] = {
    id,
    name: req.body.name,
    number: req.body.number
  };
  res.json(persons[id]);
});

app.get("/api/persons/:id", (req, res, next) => {
  const person = persons[req.params.id];
  if (!person) {
    return next(createError.NotFound());
  }
  res.json(person);
});

app.delete("/api/persons/:id", (req, res, next) => {
  delete persons[req.params.id];
  res.sendStatus(204);
});

app.use((err, req, res, next) => {
  if (err instanceof createError.HttpError) {
    return next(err);
  }
  console.error(err);
  next(createError.InternalServerError());
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    error: true,
    statusCode: err.statusCode,
    message: err.expose ? err.message : "Something went wrong"
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
