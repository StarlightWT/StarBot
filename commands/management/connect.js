const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	SlashCommandMentionableOption,
	EmbedBuilder,
} = require("discord.js");
const config = require("../../config.json");
const mongoose = require("mongoose");
const schema = require("../../schemas/user");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("connect")
		.setDescription("connect your discord account with StarDash")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addStringOption((option) =>
			option
				.setName("token")
				.setDescription("Token from StarDash")
				.setRequired(true)
		),

	async execute(interaction) {
		const token = interaction.options.getString("token");
		await mongoose.connect(config.DATABASE_URI);

		await schema.userModel.findOneAndUpdate(
			{ id: token },
			{ discordId: interaction.user.id }
		);

		interaction.reply({ content: "Connected!", ephemeral: true });
	},
};