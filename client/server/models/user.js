const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

//schema for the database to pertain the necessary values obtained from the user
const userSchema = new mongoose.Schema({
	//full name of the user
	fullName: { type: String, required: true },
	//email:unique - to identify the user
	email: { type: String, required: true },
	//password to access the account
	password: { type: String, required: true },
	//list of the expressions tests used by the user and also the coverage type used
	predicatesAndCoverageTypes: [{
		predicateExpression: String,
		coverageType: String,
	  }],
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

//create the declared user schema
const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		fullName: Joi.string().required().label("Full Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		//predicateList: [Joi.string.required().label("Enter your expression:"),Joi.string.required().label("Select Coverage Type:")]
	});
	return schema.validate(data);
};

module.exports = { User, validate };
