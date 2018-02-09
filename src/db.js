const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URL);

const toJSON = {
  transform: (doc, { _id, __v, ...rest }) => ({
    id: _id,
    ...rest
  })
};

const personSchema = new Schema(
  {
    name: String,
    number: String
  },
  { toJSON }
);

const Person = mongoose.model("Person", personSchema);

module.exports = { Person };
