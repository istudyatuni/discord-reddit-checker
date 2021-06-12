const { prefix } = require('./config.json');

function parseMessage (message) {
	const args = message.slice(prefix.length).trim().split(/ +/)
	const command = args.shift().toLowerCase()

	return {
		args: args,
		command: command
	}
}

module.exports = { parseMessage }
