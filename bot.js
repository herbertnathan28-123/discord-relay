require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Client, GatewayIntentBits } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_NAME = 'pace-upload';
const WEBHOOK_URL = 'https://atlas-nathan28.app.n8n.cloud/webhook/alliance-upload-production';

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

let fullText = '';

if (message.attachments.size > 0) {
  const attachment = message.attachments.first();
  const response = await fetch(attachment.url);
  fullText = await response.text();
} else {
  fullText = message.content;
}

if (!fullText.includes('/a')) return;

const parts = fullText.split('/a');
if (parts.length < 3) return;

const teamData = parts[1].trim();
  const payload = {
    type: "allianceUpload",
    discordId: message.author.id,
    rawText: teamData
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Relayed to n8n');
  } catch (err) {
    console.error('Error sending to n8n:', err);
  }
});

client.login(DISCORD_TOKEN);
