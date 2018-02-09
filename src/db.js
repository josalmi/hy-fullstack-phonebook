const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const Person = mongoose.model("Person", {
  name: String,
  number: String
});

module.exports = { Person };
