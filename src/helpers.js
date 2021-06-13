const { prefix } = require('../config.json');

function parseMessage (message) {
	const args = message.slice(prefix.length).trim().split(/ +/)
	const command = args.shift().toLowerCase()

	return {
		args: args,
		command: command
	}
}

function getHelp () {
	return '# Possible commands\n\n' +
	'- !delete <number> - delete last <number> messages (message about delete not count), ' +
	'<number> should be from 1 to 99\n' +
	'- !load <level> <limit>, where:\n' +
	'  - level is hot, new, etc\n' +
	'  - limit is count of posts which need to be loaded\n' +
	'- !help - show this help'
}

module.exports = { parseMessage, getHelp }
