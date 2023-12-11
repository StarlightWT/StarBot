const mongoose = require("mongoose");
const lockSchema = new mongoose.Schema({
	id: String,
	userId: String,
	modules: Array,
});

const lockModel = mongoose.model("Lock", lockSchema, "locks");

module.exports = {
	lockSchema,
	lockModel,
};
