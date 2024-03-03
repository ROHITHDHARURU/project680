const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	bio:{type:String, required:true},
	image2:{type:String, required:true},
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

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		fullName: Joi.string().required().label("Full Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		bio: Joi.string().required().label("Bio"),
		image2: Joi.string().required().label("Image"),
		//predicateList: [Joi.string.required().label("Enter your expression:"),Joi.string.required().label("Select Coverage Type:")]
	});
	return schema.validate(data);
};

module.exports = { User, validate };
