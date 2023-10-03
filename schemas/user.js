const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	username: String,
	id: String,
	subscribed: Boolean,
	role: String,
});

const userModel = mongoose.model("User", userSchema, "users");

module.exports = {
	userSchema,
	userModel,
};
