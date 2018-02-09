const mongoose = require("mongoose");

async function main(args) {
  const connection = await mongoose.connect(process.env.MONGO_URL);
  try {
    const Person = mongoose.model("Person", {
      name: String,
      number: String
    });
    if (args.length === 2) {
      const [name, number] = args;
      await new Person({ name, number }).save();
      console.log(`lisätään henkilö ${name} numero ${number} luetteloon`);
    } else {
      const persons = await Person.find({});
      console.log("puhelinluettelo:");
      persons.forEach(person => {
        console.log(person.name, person.number);
      });
    }
  } finally {
    connection.disconnect();
  }
}

const args = process.argv.slice(2);
main(args).catch(err => console.error(err));
