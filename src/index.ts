import {Buttons} from "./classes/interactions/buttons/button.interaction.class";
import {Commission} from "./classes/commissions/commission.class";
import {CommissionOwner} from "./classes/commissions/commission.owner.class";
import {BitField, Client, Partials} from "discord.js";
import {DISCORD_BOT_ID, DISCORD_BOT_SECRET} from "./environment";
import {dealWithCommand, deployCommands} from "./interactions/commandInteractions";
import {CommissionChannel} from "./classes/commissions/commission.channel.class";

const dbSync = async () => {
    await Buttons.sync();

    await Commission.sync();
    await CommissionOwner.sync();
    await CommissionChannel.sync();
}

const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", async () => {
    await dbSync();

    console.log("Bot has been launched!");
    console.log(client.generateInvite({
        // @ts-ignore
        permissions: new BitField(8),
        scopes: [
            // @ts-ignore
            "bot"
        ]
    }));

    client.guilds.cache.forEach(async guild => {
        await deployCommands({guildId: guild.id}, DISCORD_BOT_ID as string);
    });
});

client.on("guildCreate", async (guild) => {
    await deployCommands({guildId: guild.id}, DISCORD_BOT_ID as string);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await dealWithCommand(interaction);
    }
});

client.on("messageReactionRemove", async (messageReaction, user) => {
});

client.on("messageReactionAdd", async (messageReaction, user) => {
});

client.on("guildMemberAdd", async (member) => {
});

client.login(DISCORD_BOT_SECRET);