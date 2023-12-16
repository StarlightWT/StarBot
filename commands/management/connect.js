const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config.json");
const mongoose = require("mongoose");
const schema = require("../../schemas/user");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("connect")
		.setDescription("connect your discord account with StarDash")
		.addStringOption((option) =>
			option
				.setName("token")
				.setDescription("Token from StarDash")
				.setRequired(true)
		),

	async execute(interaction) {
		const token = interaction.options.getString("token");
		await mongoose.connect(config.DATABASE_URI);

		const user = await schema.userModel.findOne({ token: token });

		await schema.userModel.findOneAndUpdate(
			{ token: token },
			{
				discordId: interaction.user.id,
				tier: interaction.member.roles.highest.name,
			},
			{
				new: true,
			}
		);

		if (!user)
			return interaction.reply({
				content: "Connection failed!",
				ephemeral: true,
			});
		interaction.reply({ content: "Connected!", ephemeral: true });
	},
};
