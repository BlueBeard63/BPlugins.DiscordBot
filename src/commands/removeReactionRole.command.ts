import {ChannelType, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {ReactionRole} from "../classes/interactions/reaction/reaction.interaction.class";
import {Logger} from "../logger";

export const data = new SlashCommandBuilder()
    .setName("remove_reaction_role")
    .setDescription("Removes a reaction role to a message")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
    .addChannelOption(option =>
        option.setName("channel")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
        option.setName("message_id")
            .setRequired(true)
    )
    .addRoleOption(option =>
        option.setName("role")
        .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.options.get("channel")!.value as string;
    const messageId = interaction.options.get("message_id")!.value as string;
    const roleId = interaction.options.get("role")!.value as string;

    if (await ReactionRole.count({
        where: {
            channelId: channelId,
            messageId: messageId,
            roleId: roleId
        }
    }) === 0) {
        const embed = new EmbedBuilder()
            .setTitle("Reaction Role | Error")
            .setDescription("Could not find the reaction role you are trying to remove. Please contact your bot developer for further support.")

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });
        return;
    }

    try{
        await ReactionRole.destroy({
            where: {
                channelId: channelId,
                messageId: messageId,
                roleId: roleId
            }
        });

        Logger.LogInfo(`Removed reaction role requested by user: ${interaction.user.displayName}`);

        const embed = new EmbedBuilder()
            .setTitle("Reaction Role")
            .setDescription("You have removed the reaction role requested");

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });
    }
    catch {
        Logger.LogError(`Could not remove the reaction role requested by user: ${interaction.user.displayName}`);

        const embed = new EmbedBuilder()
            .setTitle("Reaction Role | Error")
            .setDescription("Could not remove the reaction role. Please contact your bot developer for further support.")

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });
    }
}