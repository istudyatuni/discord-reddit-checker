const config = require('./config.json');
const prefix = config.prefix;

const { parseMessage, getHelp } = require('./src/helpers.js');
const { loadPosts } = require('./src/reddit-parse.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Logged in');
	client.channels.cache.get(config.chat_id).send('Logged in');
});

client.login(config.token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const m = parseMessage(message.content);
	console.log('Received message:', m);
	if (m.command === 'delete') {
		if (m.args.length === 1 && +m.args[0] >= 1 && +m.args[0] <= 100) {
			message.channel.bulkDelete(+m.args[0] + 1);
		}
		else {
			message.channel.send('Number for delete should be from 1 to 99');
		}
	}
	else if (m.command === 'load') {
		const sendEmbedImage = (embed_data) => {
			message.channel.send({
				embed: embed_data,
			});
		};
		const sendEmbedTextInFiles = (embed, md, html) => {
			message.channel.send({
				embed: embed,
				files: [md, html],
			});
		};
		const sendText = text => {
			message.channel.send(text);
		};
		loadPosts(message.channel.name, m.args, sendEmbedImage, sendEmbedTextInFiles, sendText);
	}
	else if (m.command === 'help') {
		message.channel.send('```md\n' + getHelp() + '```');
	}
	else {
		message.channel.send('Unknown command, try `!help`');
	}
});
