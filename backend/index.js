require('dotenv').config();
const express = require('express');
//const morgan = require('morgan')
const { request, response, json } = require('express');
const app = express();
const cors = require('cors');
const Person = require('./models/person');
const mongoose = require('mongoose');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());

mongoose.set('useFindAndModify', false);

/* morgan.token('yeet', (req, res) => {
  console.log(req.body)
  return req.body
})

app.use(morgan('tiny'))

app.use(morgan(':yeet :req[content-body]')) */

app.get('/', (req, res) => {
	res.send('<h1>Hello to my test site</h1>');
});

app.get('/api/persons', (req, res) => {
	Person.find({}).then((entry) => {
		res.json(entry);
	});
});

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({ error: 'content missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number
	});

	person
		.save()
		.then((savedPerson) => savedPerson.toJSON())
		.then((formattedPerson) => res.json(formattedPerson))
		.catch((err) => next(err));
});

app.get('/info', (req, res) => {
	const timestamp = new Date();
	const utcDate = timestamp.toUTCString();

	Person.estimatedDocumentCount().then((result) => {
		res.send(`
		<p>Phonebook has info for ${result} people.</p>
		<p>${utcDate}</p>
  	`);
	});
});

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then((entry) => {
			if (entry) {
				response.json(entry);
			} else {
				response.status(404).end();
			}
		})
		.catch((err) => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((err) => next(err));
});

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
