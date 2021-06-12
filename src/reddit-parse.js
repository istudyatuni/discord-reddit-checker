const fs = require('fs')
const { decode } = require('html-entities')

const { MessageAttachment } = require('discord.js')

const https = require('https')
const options = {
	headers: {
		'User-Agent': 'Mozilla/5.0'
	},
	hostname: 'www.reddit.com',
	port: '443'
}

function parsePosts(data, sendEmbedImage, sendText) {
	let embed = {}
	for (let post of data.data.children) {
		embed = {
			title: post.data.title,
			url: 'https://www.reddit.com' + post.data.permalink,
			description: 'reddit.com',
			author: {
				name: post.data.author,
				url: 'https://www.reddit.com/user/' + post.data.author
			}
		}

		if (post.data.selftext === '') {
			// it's image
			embed.image = { url: post.data.url }
			sendEmbedImage(embed)
		} else {
			// it's text
			// https://stackoverflow.com/a/66715211
			const buffer = Buffer.from(decode(post.data.selftext_html))
			const attachment = new MessageAttachment(buffer, 'content.html')
			sendText(embed, attachment)
		}
		break
	}
}

/**
 * [loadPosts description]
 * @param  {[type]} subreddit [description]
 * @param  {[type]} level     hot (default), new, etc
 * @param  {[type]} sendEmbedImage      [description]
 * @param  {[type]} sendText  [description]
 * @return {[type]}           [description]
 */
function loadPosts(subreddit, level, sendEmbedImage, sendText) {
	if (level === undefined) level = 'hot'
	options.path = `/r/${subreddit}/${level}.json`

	let raw = ''
	const req = https.get(options, res => {
		console.log(`statusCode for ${options.path}: ${res.statusCode}`)
		res.on('data', data => {
			raw += data
		})

		res.on('end', () => {
			if (res.statusCode === 200) {
				parsePosts(JSON.parse(raw), sendEmbedImage, sendText)
			}
		})
	})

	req.on('error', err => {
		console.error(err)
	})

	req.end()
}

module.exports = { loadPosts }
