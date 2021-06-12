const config = require('./config.json');
const prefix = config.prefix

const { parseMessage } = require('./helpers.js')
const { loadPosts } = require('./reddit-parse.js')

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Logged in')
	client.channels.cache.get(config.chat_id).send('Logged in')
});

client.login(config.token);

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const m = parseMessage(message.content)
	console.log('Received message:', m)
	if (m.command === 'delete') {
		if (m.args.length === 1 && +m.args[0] >= 2 && +m.args[0] <= 100) {
			message.channel.bulkDelete(+m.args[0] + 1)
			message.channel.send('Deleted ' + m.args[0] + ' last messages (delete command not count)')
		} else {
			message.channel.send('Number for delete should be from 2 to 99')
		}
	} else if (m.command === 'load') {
		const sendEmbedImage = (embed_data) => {
			message.channel.send({
				embed: embed_data
			})
		}
		const sendText = (embed, file) => {
			message.channel.send({
				embed: embed,
				files: [file]
			})
		}
		loadPosts(message.channel.name, m.args[0], sendEmbedImage, sendText)
	}
});
