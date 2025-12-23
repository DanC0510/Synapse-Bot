# Synapse-Bot

Custom Discord Bot designed for music from youtube, polls, reaction roles and more!



# How to Install

### Step 1 - Setting up the Bot Profile

Go to Discord Developer Portal \[discord.com/developers]

Create a new Application, you can name it whatever you want to.

Save your Application ID from the "General Information" tab.

Go into the "Bot" tab and press the "Reset Token" button. Save this token.
Enable public bot.

Head into the "Installation" tab.

Ensure User Install and Guild Install methods are both enabled.
For User Install, select "applications.commands".

For Guild Install, select "applications.commands" and "bot".
A new dropdown box will appear. Give the bot Administrator permissions.
You can now scroll up to "Install Link" and copy the link and put it in your browser and inviting it to your server.



### Step 2 - Setting up the config file

Clone this repository onto your computer.

Then open up config.json.example using any text editor of your choice.

Insert your token from the "Bot" tab in the "token" field.
Insert your Application ID from the "General Information" tab in the "clientId" field.

In the discord server you are putting the bot into, right click on the server name and press "Copy Server ID". (You will need developer mode enabled on your discord client for this)

Place the Server ID in the "guildId" field.
Save the file and remove the .example from the filename.



### Step 3 - Running the Bot

Ensure you have npm and node installed on your system.

Run "npm init -y" in your terminal.

Then run "npm install discord.js" in your terminal.
Then run "node index.js" in your terminal.
Your bot is now up and running!

