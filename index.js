const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL; 
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID; // Your specific channel ID

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.channel.id !== LOG_CHANNEL_ID) return;

    if (message.content.includes('Platform:') && message.content.includes('Offense:')) {
        try {
            const platform = message.content.match(/Platform:\s*(.*)/i)?.[1]?.trim() || "N/A";
            const username = message.content.match(/Username:\s*(.*)/i)?.[1]?.trim() || "N/A";
            const offense = message.content.match(/Offense:\s*(.*)/i)?.[1]?.trim() || "N/A";
            const punishment = message.content.match(/Punishment:\s*(.*)/i)?.[1]?.trim() || "N/A";
            const proof = message.content.match(/Proof:\s*(.*)/i)?.[1]?.trim() || "N/A";

            const payload = {
                sender: message.author.tag,
                platform: platform,
                username: username,
                offense: offense,
                punishment: punishment,
                proof: proof
            };

            await axios.post(GOOGLE_SCRIPT_URL, payload);
            await message.react('✅');

        } catch (error) {
            console.error("Failed to log to Google Sheets:", error);
            await message.reply("Error logging punishment to database.");
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
