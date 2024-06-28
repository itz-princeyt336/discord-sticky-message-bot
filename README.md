# Discord Sticky Message Bot

[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)

## About

This bot automatically sends a sticky message after a specified number of messages in a Discord channel.

## Support

- Support is provided only for bugs and errors occurring during the running of the code.
- Installation issues are not supported.
- The code will be updated with major library releases as needed.

## Contributing

- Pull requests are welcome for bug fixes, typos, or grammatical corrections.
- For new features, please fork the repository.

## Requirements

- [Node.js](https://nodejs.org) v14 or higher
- NPM (included with Node.js) or [Yarn](https://yarnpkg.com)

**Note:** If you use NPM, delete the `yarn.lock` file.

## Getting Started

1. Clone or [download](https://github.com/itz_princeyt336/discord-sticky-message-bot/releases) this repository.
2. Navigate to the folder where you cloned or downloaded the repository.
3. Run `npm install` or `yarn install` depending on your package manager.
4. Rename `.env.example` to `.env` and fill in the necessary information:
    ```env
    DISCORD_TOKEN=(your bot token)
    MAX_MESSAGE_COUNT=(number of messages before the bot sends the sticky message again, minimum 5 to comply with Discord ToS)
    OWNER=(your user ID or another user ID, e.g., server owner)
    ```
5. Start the bot with `node index.js`.

## Usage

```
/stick <message you want to stick>
/unstick <channel>
/ping
/list
/info
```

## Libraries Used

- [Discord.js](https://github.com/discordjs/discord.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [ESLint](https://github.com/eslint/eslint) (dev dependency)

## License

This project is licensed under the GPLv3 License. See the [LICENSE](https://www.gnu.org/licenses/gpl-3.0.en.html) file for details.
