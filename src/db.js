const mongoose = require('mongoose')
const { Schema } = mongoose

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGO_URL)

const toJSON = {
  // eslint-disable-next-line no-unused-vars
  transform: (doc, { _id, __v, ...rest }) => ({
    id: _id,
    ...rest
  })
}

const personSchema = new Schema(
  {
    name: { type: String, unique: true },
    number: String
  },
  { toJSON }
)

const Person = mongoose.model('Person', personSchema)

module.exports = { Person }
