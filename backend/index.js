const express = require('express')
//const morgan = require('morgan')
const { request, response, json } = require('express')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


/* morgan.token('yeet', (req, res) => {
  console.log(req.body)
  return req.body
})

app.use(morgan('tiny'))

app.use(morgan(':yeet :req[content-body]')) */

let persons = [
  {
    name: "James",
    number: "1231325",
    id: 1
  },
  {
    name: "Alex",
    number: "11234425",
    id: 2
  },
  {
    name: "Jeff",
    number: "1223145",
    id: 3
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello to my test site</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const generateId = () => {
  const id = persons.length
  return id +1
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name exists'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id : generateId()
  }

  persons = persons.concat(person)

  res.json(person)
})

app.get('/info', (req, res) => {
  const total = persons.length
  const timestamp = new Date()
  const utcDate = timestamp.toUTCString()

  res.send(`
    <p>Phonebook has info for ${total} people.</p>
    <p>${utcDate}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})