const mongoose = require("mongoose");
const { SlashCommandBuilder } = require("discord.js");
const { lockModel } = require("../../schemas/lock");
const config = require("../../config.json");
const { userModel } = require("../../schemas/user");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("givetask")
		.setDescription("Give a user a task!")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Who to give task to")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("task").setDescription("What's the task").setRequired(true)
		),
	async execute(interaction) {
		await mongoose.connect(config.DATABASE_URI);
		const user = interaction.options.getUser("user");
		const task = interaction.options.getString("task");

		const userDB = await userModel.findOne({ discordId: user.id });
		if (!userDB) return error("User not found!", interaction);
		const lockDB = await lockModel.findOne({ userId: userDB.id });
		if (!lockDB) return error("User's lock not found!", interaction);

		const moduleDB = lockDB.modules.find((obj) => obj.name == "Tasks");

		switch (moduleDB.giveTasks) {
			case "0": // Doesn't accept tasks from anyone
				return error("User doesn't accept tasks from anyone", interaction);
			case "1": //Accepts tasks from KH
				return error("Currently not supported", interaction);
			case "2":
				break;
			default:
				return error("Unexpected error!", interaction);
		}

		if (moduleDB.taskList.length + moduleDB.assignedTasks.length >= 30)
			return error("This user has reached max tasks!", interaction);

		mongoose.disconnect();
	},
};

function error(message, interaction) {
	mongoose.disconnect();
	return interaction.reply({ content: message, ephemeral: true });
}
