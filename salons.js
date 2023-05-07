const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
const readline = require('readline');

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  getServerId();
});

async function getServerId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Entrez l\'ID du serveur Discord: ', async (serverId) => {
    rl.close();

    const guild = client.guilds.cache.get(serverId);
    if (!guild) {
      console.log(`Impossible de trouver le serveur avec l'ID ${serverId}`);
      process.exit(0);
    }

    const confirmation = await confirmAction(`Voulez-vous vraiment supprimer tous les salons de ${guild.name} ? (Oui/Non): `);

    if (confirmation) {
      deleteAllChannels(guild);
    } else {
      console.log('Opération annulée');
      process.exit(0);
    }
  });
}

async function confirmAction(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'oui');
    });
  });
}

async function deleteAllChannels(guild) {
  const channels = Array.from(guild.channels.cache.values());
  let channelCount = 0;

  for (const channel of channels) {
    if (channel.deletable) {
      try {
        await channel.delete();
        channelCount++;
      } catch (error) {
        console.error(`Impossible de supprimer le salon ${channel.name} : `, error);
      }
    }
  }

  console.log(`Supprimé ${channelCount} salons sur le serveur ${guild.name}`);
  process.exit(0);
}


client.login('');
