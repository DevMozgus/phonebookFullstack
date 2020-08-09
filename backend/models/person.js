const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.log('Error connecting to MongoDB', err.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: Number,
		minlength: 5,
		required: true
	}
});

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Person', personSchema);
