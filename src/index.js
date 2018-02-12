const { STATUS_CODES } = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const { celebrate, errors, Joi } = require('celebrate')
const morgan = require('morgan')

const { Person } = require('./db')

morgan.token('body', req => JSON.stringify(req.body))

const app = express()
app.use(
  morgan(':method :url :body :status :res[content-length] - :response-time ms')
)
app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/info', async (req, res, next) => {
  try {
    res.render('info', { persons: await Person.count(), date: new Date() })
  } catch (err) {
    next(err)
  }
})

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (err) {
    next(err)
  }
})

app.post(
  '/api/persons',
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      number: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const person = await new Person(req.body).save()
      res.json(person)
    } catch (err) {
      if (err.code === 11000) {
        next(createError.BadRequest('person with name already exists'))
      } else {
        next(err)
      }
    }
  }
)

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (!person) {
      return next(createError.NotFound())
    }
    res.json(person)
  } catch (err) {
    next(err)
  }
})

app.patch(
  '/api/persons/:id',
  celebrate({
    body: Joi.object({
      number: Joi.string().required()
    })
  }),
  async (req, res, next) => {
    try {
      const person = await Person.findByIdAndUpdate(req.params.id, req.body, {
        new: true
      })
      res.json(person)
    } catch (err) {
      next(err)
    }
  }
)

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.sendStatus(204)
  } catch (err) {
    next(new createError.BadRequest('Malformatted id'))
  }
})

app.use(errors())

app.use((err, req, res, next) => {
  if (err instanceof createError.HttpError) {
    return next(err)
  }
  console.error(err)
  next(createError.InternalServerError())
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    error: STATUS_CODES[err.statusCode] || 'Unknown error',
    statusCode: err.statusCode,
    message: err.expose ? err.message : 'Something went wrong'
  })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
