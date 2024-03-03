const mongoose = require("mongoose");

const connectionString = process.env.DATABASE_ACCESS;

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		mongoose.connect(connectionString, connectionParams);
		console.log("Connected to database successfully");
		console.log(process.env.DATABASE_ACCESS)
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
