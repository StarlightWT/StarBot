const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
	name: { type: String, default: "Tasks" },
	khId: { type: String, default: null },
	enabled: { type: Boolean, default: false },
	locked: { type: Boolean, default: false },
	taskList: [],
	assignedTasks: [],
	taskLog: [],
	giveTasks: { type: Number, default: 0 },
});

module.exports = {
	taskSchema,
};
