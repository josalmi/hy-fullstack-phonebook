const { STATUS_CODES } = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { celebrate, errors, Joi } = require("celebrate");
const morgan = require("morgan");

morgan.token("body", (req, res) => JSON.stringify(req.body));

const app = express();
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);
app.set("view engine", "pug");
app.use(express.static('public'))
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

app.post(
  "/api/persons",
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      number: Joi.string().required()
    })
  }),
  (req, res, next) => {
    if (Object.values(persons).find(person => person.name === req.body.name)) {
      return next(createError.BadRequest(`"name" must be unique`));
    }
    const id = Math.floor(Math.random() * 1000000);
    persons[id] = {
      ...req.body,
      id
    };
    res.json(persons[id]);
  }
);

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

app.use(errors());

app.use((err, req, res, next) => {
  if (err instanceof createError.HttpError) {
    return next(err);
  }
  console.error(err);
  next(createError.InternalServerError());
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    error: STATUS_CODES[err.statusCode] || "Unknown error",
    statusCode: err.statusCode,
    message: err.expose ? err.message : "Something went wrong"
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
