const mongoose = require('mongoose');

if (process.argv.length < 3) {
	console.log('Please include password as argument: node mongo.js <password> [name] [number]');
	process.exit(1);
}

const password = process.argv[2];

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const Person = mongoose.model('Person', personSchema);

const personName = process.argv[3];
const personNumber = process.argv[4];
const person = new Person({
	name: `${personName}`,
	number: `${personNumber}`
});

if (process.argv.length === 3) {
	Person.find({})
		.then((response) => {
			response.forEach((entry) => {
				console.log(entry.name, entry.number);
			});
			mongoose.connection.close();
		})
		.catch((err) => console.log(err));
} else {
	person
		.save()
		.then((response) => {
			console.log('Person saved: ', personName, personNumber);
			mongoose.connection.close();
		})
		.catch((err) => console.log(err));
}
