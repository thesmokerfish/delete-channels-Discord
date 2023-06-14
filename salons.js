const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
const readline = require('readline');

client.on('ready', () => {
  console.log("----------------------------------------");
  console.log("         Connecté !         ");
  console.log("https://discord.com/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot")
  console.log("----------------------------------------");
  console.log("Pseudo  : " + client.user.username)
  console.log("ID : " + client.user.id)
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
  const deletableChannels = channels.filter(channel => channel.deletable);
  const channelCount = deletableChannels.length;

  try {
    await Promise.all(deletableChannels.map(channel => channel.delete()));
    console.log(`Supprimé ${channelCount} salons sur le serveur ${guild.name}`);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la suppression des salons :', error);
  }

  process.exit(0);
}

client.login('TOKEN');
