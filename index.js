require("dotenv").config();
const { Client, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const maxMessageCount = parseInt(process.env.MAX_MESSAGE_COUNT);
const stickyMessages = new Map(); // To store sticky messages for each channel

client.once("ready", async () => {
  console.info(`Bot ready! | ${client.user.tag}`);

  // Set custom status
  client.user.setPresence({
    status: 'online', // 'online', 'idle', 'dnd', or 'invisible'
    activities: [{
      name: 'with sticky messages', // Custom status message
      type: 'PLAYING' // 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'
    }],
  });

  // Register slash commands
  try {
    await client.application.commands.set([
      {
        name: 'stick',
        description: 'Stick a message to the channel',
        options: [
          {
            name: 'message',
            description: 'The message content to stick',
            type: 'STRING',
            required: true,
          },
        ],
      },
      {
        name: 'unstick',
        description: 'Unstick the message from a specified channel',
        options: [
          {
            name: 'channel',
            description: 'The channel to unstick the message from',
            type: 'CHANNEL',
            required: true,
          },
        ],
      },
      {
        name: 'list',
        description: 'List all channels with sticky messages',
      },
      {
        name: 'info',
        description: 'Get bot statistics and owner information',
      },
      {
        name: 'ping',
        description: 'Get the bot\'s ping',
      }
    ]);
    console.info('Slash commands registered.');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "stick") {
    try {
      const channel = interaction.channel;
      const messageContent = options.getString('message');
      
      if (stickyMessages.has(channel.id)) {
        await stickyMessages.get(channel.id).message.delete();
      }

      const stickyMessage = await channel.send(messageContent);
      stickyMessages.set(channel.id, { count: 0, message: stickyMessage });

      await interaction.reply({ content: `Message "${messageContent}" is set to sticky.`, ephemeral: true });
    } catch (error) {
      console.error("Error sticking message:", error);
      await interaction.reply({ content: 'There was an error setting the sticky message.', ephemeral: true });
    }
  } else if (commandName === "unstick") {
    try {
      const channel = options.getChannel('channel');
      
      if (stickyMessages.has(channel.id)) {
        await stickyMessages.get(channel.id).message.delete();
        stickyMessages.delete(channel.id);
        await interaction.reply({ content: `Sticky message in <#${channel.id}> has been unstuck.`, ephemeral: true });
      } else {
        await interaction.reply({ content: `No sticky message found in <#${channel.id}>.`, ephemeral: true });
      }
    } catch (error) {
      console.error("Error unsticking message:", error);
      await interaction.reply({ content: 'There was an error unsticking the message.', ephemeral: true });
    }
  } else if (commandName === "list") {
    try {
      if (stickyMessages.size > 0) {
        const channelsList = Array.from(stickyMessages.keys()).map(channelId => `<#${channelId}>`).join('\n');
        await interaction.reply({ content: `Channels with sticky messages:\n${channelsList}`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'No sticky messages are currently set in any channels.', ephemeral: true });
      }
    } catch (error) {
      console.error("Error listing sticky messages:", error);
      await interaction.reply({ content: 'There was an error listing the sticky messages.', ephemeral: true });
    }
  } else if (commandName === "info") {
    try {
      const embed = new MessageEmbed()
        .setTitle("Bot Information")
        .addField("Bot Tag", client.user.tag, true)
        .addField("Bot ID", client.user.id, true)
        .addField("Owner", `<@${process.env.OWNER}>`, true)
        .addField("Servers", client.guilds.cache.size.toString(), true)
        .addField("Channels", client.channels.cache.size.toString(), true)
        .setColor("BLUE")
        .setFooter("Bot Info", client.user.displayAvatarURL());

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error fetching bot info:", error);
      await interaction.reply({ content: 'There was an error fetching the bot information.', ephemeral: true });
    }
  } else if (commandName === "ping") {
    try {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(`Pong! Latency is ${timeTaken}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
    } catch (error) {
      console.error("Error fetching ping:", error);
      await interaction.reply({ content: 'There was an error fetching the ping.', ephemeral: true });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const channel = message.channel;
  if (stickyMessages.has(channel.id)) {
    let { count, message: stickyMessage } = stickyMessages.get(channel.id);
    count++;
    if (count >= maxMessageCount) {
      try {
        await stickyMessage.delete();
        stickyMessage = await channel.send(stickyMessage.content);
        count = 0;
        stickyMessages.set(channel.id, { count, message: stickyMessage });
      } catch (error) {
        console.error("Error sending sticky message:", error);
      }
    } else {
      stickyMessages.set(channel.id, { count, message: stickyMessage });
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Error logging in:", error);
});
