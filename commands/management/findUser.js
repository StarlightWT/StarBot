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
		.setName("finduser")
		.setDescription("Finds a user in DB")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addStringOption((option) =>
			option
				.setName("search")
				.setDescription("Name/ID of the user")
				.setRequired(true)
		),

	async execute(interaction) {
		const searchString = interaction.options.getString("search");
		await mongoose.connect(config.DATABASE_URI);
		var searchRecord =
			(await schema.userModel.findOne({ id: searchString })) ||
			(await schema.userModel.findOne({
				username: { $regex: new RegExp(searchString, "i") },
			})) ||
			(await schema.userModel.findOne({ discordId: searchString }));
		if (searchRecord == null)
			return interaction.reply({ content: "User not found!", ephemeral: true });
		var replyEmbed = new EmbedBuilder()
			.setTitle(`User search: ${searchString}`)
			.setColor("#8f2efd")
			.setFields(
				{ name: "Username", value: searchRecord.username },
				{
					name: "Discord",
					value: `<@${searchRecord.discordId}>`,
				},
				{
					name: "subscribed",
					value: `${searchRecord.subscribed}`,
				},
				{ name: "role", value: searchRecord.role, inline: true },
				{ name: "tier", value: `${searchRecord.tier}`, inline: true },
				{ name: "id", value: searchRecord.id, inline: true }
			);

		interaction.reply({ embeds: [replyEmbed], ephemeral: true });
	},
};
