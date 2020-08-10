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
mongoose.set('useCreateIndex', true);

/* morgan.token('yeet', (request, response) => {
  console.log(request.body)
  return request.body
})

app.use(morgan('tiny'))

app.use(morgan(':yeet :request[content-body]')) */

app.get('/', (request, response) => {
	response.send('<h1>Hello to my test site</h1>');
});

app.get('/api/persons', (request, response) => {
	Person.find({}).then((entry) => {
		response.json(entry);
	});
});

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({ error: 'content missing' });
	}

	const person = new Person({
		name: body.name,
		number: body.number
	});

	person
		.save()
		.then((savedPerson) => savedPerson.toJSON())
		.then((formattedPerson) => response.json(formattedPerson))
		.catch((err) => next(err));
});

app.get('/info', (request, response) => {
	const timestamp = new Date();
	const utcDate = timestamp.toUTCString();

	Person.estimatedDocumentCount().then((result) => {
		response.send(`
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

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
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
