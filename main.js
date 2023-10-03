const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { REST, Routes } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.config = require("./config.json");

client.once(Events.ClientReady, (event) => {
	console.log(`Ready! Logged in as ${event.user.tag}`);
});

//Register commands
client.commands = new Collection();

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}
const rest = new REST().setToken(client.config.token);

(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		const data = await rest.put(
			Routes.applicationGuildCommands(
				client.config.clientId,
				client.config.guildId
			),
			{ body: commands }
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

// Log in to Discord with your client's token
client.login(client.config.token);
