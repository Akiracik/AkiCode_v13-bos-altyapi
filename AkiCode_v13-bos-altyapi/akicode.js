const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { token, clientId, guildId } = require('./config.json');

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS] 
});

client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Slash komutlarını yükleme fonksiyonu
async function deployCommands() {
    const rest = new REST({ version: '9' }).setToken(token);
    try {
        console.log('Slash komutları yükleniyor...');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Slash komutları başarıyla yüklendi!');
    } catch (error) {
        console.error('Slash komutları yüklenirken bir hata oluştu:', error);
    }
}

client.once('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    deployCommands();
});

client.login(token);