import {Buttons} from "./classes/interactions/buttons/button.interaction.class";
import {Commission} from "./classes/commissions/commission.class";
import {CommissionOwner} from "./classes/commissions/commission.owner.class";
import {Client, Events, GatewayIntentBits, Partials} from "discord.js";
import {DEFAULT_ROLE_ID, DISCORD_BOT_ID, DISCORD_BOT_SECRET} from "./environment";
import {dealWithCommand, deployCommands} from "./interactions/commandInteractions";
import {CommissionChannel} from "./classes/commissions/commission.channel.class";
import {dealWithButton} from "./interactions/buttonInteractions";
import {dealWithModel} from "./interactions/modalInteractions";

const dbSync = async () => {
    await Buttons.sync();

    await Commission.sync();
    await CommissionOwner.sync();
    await CommissionChannel.sync();
}

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", async () => {
    await dbSync();

    console.log("Bot has been launched!");
    console.log("https://discord.com/oauth2/authorize?client_id=1335982855444107285&permissions=8&integration_type=0&scope=bot");

    client.guilds.cache.forEach(async guild => {
        await deployCommands({guildId: guild.id}, DISCORD_BOT_ID as string);
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
        console.log(`${interaction.member?.user.username} has called command.`);
        await dealWithCommand(interaction);
    }
    if (interaction.isButton()) {
        console.log(`${interaction.member?.user.username} has pressed button.`);
        await dealWithButton(interaction);
    }
    if (interaction.isModalSubmit()) {
        console.log(`${interaction.member?.user.username} has submitted a modal.`);
        await dealWithModel(interaction);
    }
});

client.on(Events.MessageReactionRemove, async (messageReaction, user) => {
});

client.on(Events.MessageReactionAdd, async (messageReaction, user) => {
});

client.on(Events.GuildMemberAdd, async (member) => {
    console.log(`New User: ${member.displayName} has joined!`);
    await member.roles.add(DEFAULT_ROLE_ID);
});

client.login(DISCORD_BOT_SECRET);