import {
    ChannelType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import {ReactionRole} from "../classes/interactions/reaction/reaction.interaction.class";
import {Logger} from "../logger";

export const data = new SlashCommandBuilder()
    .setName("add_reaction")
    .setDescription("Adds a reaction role to a message")
    .addChannelOption(option =>
        option.setName("channel")
            .setDescription("This is the channel for the message")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
        option.setName("message_id")
            .setDescription("This is the message id for the reaction role")
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName("role")
            .setDescription("This is the role that is given to the user")
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("reaction")
            .setDescription("This is the reaction used in the message.")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles);

export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.options.get("channel_id")!.value as string;
    const messageId = interaction.options.get("message_id")!.value as string;
    const roleId = interaction.options.get("role")!.value as string;
    const reaction = (interaction.options.get("reaction")!.value as string);
    const reactionId = reaction.codePointAt(1)!.toString()

    try{
        await ReactionRole.create({
            channelId: channelId,
            messageId: messageId,
            reactionId: reactionId,
            roleId: roleId,
        });

        Logger.LogInfo(`Created reaction role called by user: ${interaction.user.displayName}`);

        const embed = new EmbedBuilder()
            .setTitle("Reaction Role")
            .setDescription(`Created reaction role for reaction (${reaction}).`)

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });

        const channel = (await interaction.client.channels.cache.get(channelId)!.fetch()) as TextChannel;
        const message = await channel.messages.fetch(messageId);

        await message.react(reaction);
    }
    catch {
        Logger.LogError("Error has occurred while adding reaction role to table!");

        const embed = new EmbedBuilder()
            .setTitle("Reaction Role | Error")
            .setDescription(`Error has occurred while creating reaction role requested. Please contact your bot developer for further support.`)

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });
    }
}