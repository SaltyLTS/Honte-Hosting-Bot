# Honte-Hosting Discord Bot

## Introduction
This Discord bot provides system status updates for Honte-Hosting services. It uses Discord.js and ping to check the status of specified hosts and displays the information in a Discord channel.

## Features
- Auto-updates system status in a Discord channel every 10 seconds.
- Provides status information for Main, Panel, Dashboard, PhpMyAdmin, Nodes, and Databases.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SaltyLTS/Honte-Hosting-Bot.git
   cd Honte-Hosting-Bot

Install dependencies:
npm install

Create a .env file in the project root and add your Discord bot token:
TOKEN=your-bot-token

To launch the bot:
node index.js

Configuration:
Edit the hosts array to include the hosts you want to monitor.
Replace channelId with the ID of your Discord channel.

Dependencies:
Discord.js
ping
dotenv

License:
This project is licensed under the MIT License.

Contributing:
Feel free to contribute by opening issues or pull requests.

Acknowledgments:
Discord.js for the Discord API library.
ping for the ping utility.
dotenv for loading environment variables.
