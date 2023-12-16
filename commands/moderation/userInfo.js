const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");
const schema = require("../../schemas/user");
const { lockModel } = require("../../schemas/lock");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("Get user's profile")
		.addUserOption((option) =>
			option.setName("user").setDescription("The user")
		),
	async execute(interaction) {
		let user = interaction.options.getUser("user");
		if (!user) user = interaction.user;
		await mongoose.connect(config.DATABASE_URI);
		var searchRecord = await schema.userModel.findOne({ discordId: user.id });
		if (searchRecord == null)
			return interaction.reply({ content: "User not found!", ephemeral: true });
		// if (searchRecord.tier == "Premium")
		// 	var lockRecord = await lockModel.findOne({ "user.discordId": user.id });
		let embed = new EmbedBuilder().addFields(
			{ name: "Username", value: searchRecord.username },
			{ name: "Role", value: searchRecord.role },
			{ name: "Tier", value: searchRecord.tier }
		);

		interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
