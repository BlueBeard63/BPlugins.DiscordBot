# BPlugins Bot

This is a custom discord bot designed for the [BPlugins Discord](https://discord.gg/F9HPcjkfxH), the bot can be fully deployed on a docker container for running, or you can run the command `npm run start`.

For more information todo with installation and running please consult the **[Installation Guide](#installation-guide)**.

## Purpose For The Bot:

The bot was built for my commissions discord as I wanted a bot to manage the administration of opening commission threads, as well as keeping them open. The keeping them open was taken some source code from [Thread Watcher](https://github.com/ffamilyfriendly/Thread-Watcher). 

The bot has multiple tables to store data todo with the commissions, additionally all commissions don't actually get removed from the database but are flagged as the status being "Closed" or "Rejected". This provides constant logs for all previous and current commissions.

## Installation Guide:

### Option 1 - Docker Deployment:

1. Download/Clone the Repo
2. Open the folder in your terminal (`cd` to the location is recommended)
3. Run the command: `docker build -t [your docker hub username]/[what you want to call it]`
    > Example: `docker build -t bluebeard63/bplugins-bot`
4. Run the command: `docker push [your docker hub username]/[what you want to call it]:latest`
    > Example: `docker push bluebeard63/bplugins-bot:latest`
5. Connect to your server and run: `docker pull [your docker hub username]/[what you want to call it]:latest`
6. Once you have pulled the image run: `docker run -d [your docker hub username]/[what you want to call it]:latest`

### Option 2 - Running From Cli:

1. Download/Clone the Repo
2. Open the folder in your terminal (`cd` to the location is recommended)
3. Run the command: `npm install -g tsx`
4. Run the command: `npm install`
5. Once all packages are installed run: `npm run start` or `tsx ./src/index.ts`

### Option 3 - Running Using Petrodactyl Panel:

1. Download the `.json` file located under the folder `petrodactyl egg`
2. Go onto your `Admin` page of the host
3. Go to the page called `Nests`
4. Press the button called `Import Egg`
5. Select the `.json` file you downloaded in the 1st step.
6. Create a new server using the egg you just uploaded.