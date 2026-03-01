const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, PermissionFlagsBits } = require('discord.js');

const token = process.env.TOKEN;
const clientId = "1477430457917378640";

console.log("TOKEN value:", token);
console.log("TOKEN type:", typeof token);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('odp')
    .setDescription('Wyślij wiadomość jako Sekretarka Nafciarzy')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option.setName('wiadomosc')
        .setDescription('Treść wiadomości')
        .setRequired(true)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  );
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'odp') {

    const msg = interaction.options.getString('wiadomosc');

    // szybkie potwierdzenie, żeby Discord się nie pluł
    await interaction.deferReply({ flags: 64 });

    // wysyłamy wiadomość
    await interaction.channel.send({ content: msg });

    // usuwamy odpowiedź systemową
    await interaction.deleteReply();
  }
});

client.login(token);