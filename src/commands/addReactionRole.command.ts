import {ChannelType, CommandInteraction, EmbedBuilder, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {ReactionRole} from "../classes/interactions/reaction/reaction.interaction.class";
import {Logger} from "../logger";

export const data = new SlashCommandBuilder()
    .setName("add_reaction_role")
    .setDescription("Adds a reaction role to a message")
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
    )
    .addStringOption(option =>
        option.setName("reaction")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles);

export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.options.get("channel")!.value as string;
    const messageId = interaction.options.get("message_id")!.value as string;
    const roleId = interaction.options.get("role")!.value as string;
    const reaction = (interaction.options.get("reaction")!.value as string).codePointAt(1)!.toString();

    try{
        await ReactionRole.create({
            channelId: channelId,
            messageId: messageId,
            reactionId: reaction,
            roleId: roleId,
        });

        Logger.LogInfo(`Created reaction role called by user: ${interaction.user.displayName}`);

        const embed = new EmbedBuilder()
            .setTitle("Reaction Role")
            .setDescription(`Created reaction role for reaction (${interaction.options.get("reaction")!.value as string}).`)

        await interaction.reply({
            embeds: [embed],
            flags: "Ephemeral"
        });
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