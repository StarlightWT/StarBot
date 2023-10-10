const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	username: String,
	id: String,
	discordId: String,
	subscribed: Boolean,
	tier: String,
	role: String,
});

const userModel = mongoose.model("User", userSchema, "users");

module.exports = {
	userSchema,
	userModel,
};
