const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	username: String,
	id: String,
	chasterId: String,
	token: String,
	discordId: String,
	subscribed: Boolean,
	tier: { type: String, default: "Basic" },
	role: { type: String, default: "switch" },
});

const userModel = mongoose.model("User", userSchema, "users");

module.exports = {
	userSchema,
	userModel,
};
