import {Buttons} from "./classes/interactions/buttons/button.interaction.class";
import {Commission} from "./classes/commissions/commission.class";
import {CommissionOwner} from "./classes/commissions/commission.owner.class";
import {Client, Partials} from "discord.js";
import {DISCORD_BOT_SECRET} from "./environment";

const dbSync = async () => {
    await Buttons.sync();

    await Commission.sync();
    await CommissionOwner.sync();
}

const client = new Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions"],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
    dbSync();

    console.log("Bot has been launched!");
    console.log(client.generateInvite({
        // @ts-ignore
        permissions: new BitField(8),
        scopes: [
            // @ts-ignore
            "bot"
        ]
    }));

    client.guilds.cache.forEach(async (guild) => {
    });
});

client.on("guildCreate", async (guild) => {
});

client.on("interactionCreate", async (interaction) => {
});

client.on("messageReactionRemove", async (messageReaction, user) => {
});

client.on("messageReactionAdd", async (messageReaction, user) => {
});

client.on("guildMemberAdd", async (member) => {
});

client.login(DISCORD_BOT_SECRET);