const mongoose = require("mongoose");
const { taskSchema } = require("./task");
const { userSchema } = require("./user");
const lockSchema = new mongoose.Schema({
	id: String,
	user: userSchema,
	modules: [taskSchema], // Array of modules
});

const lockModel = mongoose.model("Lock", lockSchema, "locks");

module.exports = {
	lockSchema,
	lockModel,
};
