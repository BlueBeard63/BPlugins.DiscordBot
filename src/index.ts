import { Buttons } from "./classes/interactions/buttons/button.interaction.class";
import { Commission } from "./classes/commissions/commission.class";
import { CommissionOwner } from "./classes/commissions/commission.owner.class";
import { Client, EmbedBuilder, Events, GatewayIntentBits, Partials } from "discord.js";
import { DEFAULT_ROLE_IDS, DISCORD_BOT_ID, DISCORD_BOT_SECRET } from "./environment";
import { dealWithCommand, deployCommands } from "./interactions/commandInteractions";
import { CommissionChannel } from "./classes/commissions/commission.channel.class";
import { dealWithButton } from "./interactions/buttonInteractions";
import { dealWithModel } from "./interactions/modalInteractions";
import { CommissionWatcher } from "./helpers/commissionWatcher";
import { Logger } from "./logger";
import { dealWithSelectionMenu } from "./interactions/selectMenuInteractions";
import { ReactionRole } from "./classes/interactions/reaction/reaction.interaction.class";
import { PurchaseServer } from "./purchase.server";
import { Purchase } from "./classes/purchases/purchase.class";
import { Product } from "./classes/purchases/purchase.product.class";
import { PurchaseClaim } from "./classes/purchases/purchase.claim.class";

const dbSync = async () => {
    await Buttons.sync();
    await ReactionRole.sync();

    await Commission.sync();
    await CommissionOwner.sync();
    await CommissionChannel.sync();

    await Product.sync();
    await PurchaseClaim.sync();
    await Purchase.sync();
}

const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", async () => {
    await dbSync();
    new CommissionWatcher(client);

    Logger.LogInfo("Bot has been launched!");
    Logger.LogInfo("https://discord.com/oauth2/authorize?client_id=1335982855444107285&permissions=8&integration_type=0&scope=bot");

    client.guilds.cache.forEach(async guild => {
        await deployCommands({ guildId: guild.id }, DISCORD_BOT_ID as string);
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isCommand()) {
        Logger.LogInfo(`${interaction.user.displayName} has called command.`);
        await dealWithCommand(interaction);
    }
    if (interaction.isButton()) {
        Logger.LogInfo(`${interaction.user.displayName} has pressed button.`);
        await dealWithButton(interaction);
    }
    if (interaction.isModalSubmit()) {
        Logger.LogInfo(`${interaction.user.displayName} has submitted a modal.`);
        await dealWithModel(interaction);
    }
    if (interaction.isAnySelectMenu()) {
        Logger.LogInfo(`${interaction.user.displayName} has selected an option from menu.`);
        await dealWithSelectionMenu(interaction);
    }
});

client.on(Events.MessageReactionRemove, async (messageReaction, user) => {
    await messageReaction.fetch();

    if (await ReactionRole.count({
        where: {
            messageId: messageReaction.message.id,
            channelId: messageReaction.message.channelId,
            reactionId: messageReaction.emoji.toString().codePointAt(1)!.toString()
        }
    }) === 0) {
        return;
    }

    const reactionRole = await ReactionRole.findOne({
        where: {
            messageId: messageReaction.message.id,
            channelId: messageReaction.message.channelId,
            reactionId: messageReaction.emoji.toString().codePointAt(1)!.toString()
        }
    });

    if (reactionRole === null) {
        return;
    }

    await user.fetch();
    const guild = messageReaction.message.guild;

    await guild?.roles.fetch();
    guild?.members.cache.get(user.id)?.roles.remove(reactionRole.roleId, "Reaction Role Remove");

    const embed = new EmbedBuilder()
        .setTitle("Reaction Role")
        .addFields(
            { name: "Removed Role:", value: `${guild?.roles?.cache.get(reactionRole.roleId)?.name}` }
        );

    await user.send({
        embeds: [embed],
    });
});

client.on(Events.MessageReactionAdd, async (messageReaction, user) => {
    await messageReaction.fetch();

    if (await ReactionRole.count({
        where: {
            messageId: messageReaction.message.id,
            channelId: messageReaction.message.channelId,
            reactionId: messageReaction.emoji.toString().codePointAt(1)!.toString()
        }
    }) === 0) {
        return;
    }

    const reactionRole = await ReactionRole.findOne({
        where: {
            messageId: messageReaction.message.id,
            channelId: messageReaction.message.channelId,
            reactionId: messageReaction.emoji.toString().codePointAt(1)!.toString()
        }
    });

    if (reactionRole === null) {
        return;
    }

    await user.fetch();
    const guild = messageReaction.message.guild;

    await guild?.roles.fetch();
    guild?.members.cache.get(user.id)?.roles.add(reactionRole.roleId, "Reaction Role Added");

    const embed = new EmbedBuilder()
        .setTitle("Reaction Role")
        .addFields(
            { name: "Added Role:", value: `${guild?.roles?.cache.get(reactionRole.roleId)?.name}` }
        );

    await user.send({
        embeds: [embed],
    });
});

client.on(Events.GuildMemberAdd, async (member) => {
    await member.guild.roles.fetch();

    Logger.LogInfo(`New User: ${member.displayName}`);
    Logger.LogInfo("Assigning Roles To New User");
    await member.roles.add(DEFAULT_ROLE_IDS, "Default User Roles");
    Logger.LogInfo("Assigned Roles To New User");
});

Logger.createPaths("./logs");
client.login(DISCORD_BOT_SECRET);

new PurchaseServer();