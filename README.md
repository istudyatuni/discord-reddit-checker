# Reddit checker bot

Bot for checking posts from reddit

**Run**

Create `config.json` from `config.sample.json`, fill `token` and `chat_id` (now for logs). Create channel with the same name as subreddit (for example, for [/r/ProgrammerHumor](https://www.reddit.com/r/ProgrammerHumor) create channel `programmerhumor`), then you can get help with `!help` command.

### Possible commands

- !delete <number> - delete last <number> messages (message about delete not count), <number> should be from 2 to 99
- !load <level> <limit>, where:
  - level is hot, new, etc
  - limit is count of posts which need to be loaded
- !help - show this help
