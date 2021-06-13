const { decode } = require('html-entities');

const { MessageAttachment } = require('discord.js');

const https = require('https');
const options = {
	headers: {
		'User-Agent': 'Mozilla/5.0',
	},
	hostname: 'www.reddit.com',
	port: '443',
};

function parsePosts(data, sendEmbedImage, sendEmbedTextInFiles) {
	let embed = {};
	for (const post of data.data.children) {
		embed = {
			title: post.data.title,
			url: 'https://www.reddit.com' + post.data.permalink,
			description: 'reddit.com',
			author: {
				name: post.data.author,
				url: 'https://www.reddit.com/user/' + post.data.author,
			},
		};

		if (post.data.selftext === '') {
			// it's image
			embed.image = { url: post.data.url };
			sendEmbedImage(embed);
		}
		else {
			// it's text
			// https://stackoverflow.com/a/66715211
			const buffer_md = Buffer.from(decode(post.data.selftext));
			const attachment_md = new MessageAttachment(buffer_md, 'content.md');

			const buffer_html = Buffer.from(decode(post.data.selftext_html));
			const attachment_html = new MessageAttachment(buffer_html, 'content.html');

			sendEmbedTextInFiles(embed, attachment_md, attachment_html);
		}
	}
}

/**
 * [loadPosts description]
 * @param  {[type]} subreddit [description]
 * @param  {[type]} level     hot (default), new, etc
 * @param  {[type]} sendEmbedImage      [description]
 * @param  {[type]} sendEmbedTextInFiles  [description]
 * @param  {[type]} sendText  [description]
 * @return {[type]}           [description]
 */
function loadPosts(subreddit, args, sendEmbedImage, sendEmbedTextInFiles, sendText) {
	let level = '', limit = '';
	if (args.length === 1) {
		level = args[0];
	}
	else if (args.length === 2) {
		level = args[0];
		limit = '?limit=' + args[1];
	}
	options.path = `/r/${subreddit}/${level}.json${limit}`;

	let raw = '';
	const req = https.get(options, res => {
		console.log(`statusCode for ${options.path}: ${res.statusCode}`);
		res.on('data', data => {
			raw += data;
		});

		res.on('end', () => {
			if (res.statusCode === 200) {
				parsePosts(JSON.parse(raw), sendEmbedImage, sendEmbedTextInFiles);
			}
			else {
				sendText(`Error ${res.statusCode}`);
			}
		});
	});

	req.on('error', err => {
		console.error(err);
	});

	req.end();
}

module.exports = { loadPosts };
