const mongoose = require("mongoose");

const connectionString = process.env.DATABASE_ACCESS;

module.exports = () => {
	//connection parameters for the database
	const connectionParams = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};
	try {
		//connecting to mongodb cloud using the connection string using mongoose
		mongoose.connect(connectionString, connectionParams);
		console.log("Connected to database successfully");
		//console.log(process.env.DATABASE_ACCESS)
	} catch (error) {
		console.log(error);
		console.log("Error connecting to database!");
	}
};
