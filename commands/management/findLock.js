const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	SlashCommandMentionableOption,
	EmbedBuilder,
} = require("discord.js");
const config = require("../../config.json");
const mongoose = require("mongoose");
const schema = require("../../schemas/lock");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("findlock")
		.setDescription("Finds a lock in DB")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addStringOption((option) =>
			option
				.setName("search")
				.setDescription("userID/ID of the lock")
				.setRequired(true)
		),

	async execute(interaction) {
		const searchString = interaction.options.getString("search");
		await mongoose.connect(config.DATABASE_URI);
		var searchRecord =
			(await schema.lockModel.findOne({ id: searchString })) ||
			(await schema.lockModel.findOne({ userId: searchString }));

		if (searchRecord == null)
			return interaction.reply({ content: "Lock not found!", ephemeral: true });

		let moduleList = [];
		searchRecord.modules.forEach((module) => {
			moduleList.push(module.name);
		});
		moduleList = moduleList.join(", ");
		let moduleField = { name: "Modules", value: moduleList };

		var replyEmbed = new EmbedBuilder()
			.setTitle(`Lock search: ${searchString}`)
			.setColor("#8f2efd")
			.addFields(moduleField);

		interaction.reply({ embeds: [replyEmbed], ephemeral: true });
	},
};
