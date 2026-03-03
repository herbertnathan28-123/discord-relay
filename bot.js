require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_NAME = 'pace-upload';
const WEBHOOK_URL = 'https://atlas-nathan28.app.n8n.cloud/webhook/alliance-pace-upload';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name !== CHANNEL_NAME) return;
  if (!message.content.startsWith('/a')) return;

  const regex = /\/a\s*([\s\S]*?)\/a/;
  const match = message.content.match(regex);
  if (!match) return;

  const teamData = match[1].trim();
const payload = {
  type: "allianceUpload",
  discordId: message.author.id,
  rawText: teamData
};
  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Relayed to n8n');
});

client.login(DISCORD_TOKEN);
