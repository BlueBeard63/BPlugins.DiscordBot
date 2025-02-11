import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle, ChannelType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder, TextChannel
} from "discord.js";
import {randomUUID} from "crypto";
import {Buttons} from "../classes/interactions/buttons/button.interaction.class";
import {EButtonType} from "../classes/interactions/buttons/EButtonType";

export const data = new SlashCommandBuilder()
    .setName("send_commission_message")
    .setDescription("Sends the commission message")
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the open commission embed in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    const channel = interaction.options.get("channel")!.value as string;

    const embed = new EmbedBuilder()
        .setTitle("Commissions")
        .setDescription("To open a commission please press the green button `Open Commission Request`. If you are requesting help regarding a previous commission please press the grey `Help` button ");

    const createCommissionButtonId = randomUUID().toString();
    const openCommissionButton = new ButtonBuilder()
        .setCustomId(`CreateCommission-${createCommissionButtonId}`)
        .setEmoji("🎫")
        .setLabel("Open Commission Request")
        .setStyle(ButtonStyle.Success);

    const helpCommissionButtonId = randomUUID().toString();
    const helpCommissionButton = new ButtonBuilder()
        .setCustomId(`CommissionHelp-${helpCommissionButtonId}`)
        .setEmoji("🆘")
        .setLabel("Help")
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [
            openCommissionButton,
            helpCommissionButton
        ]
    });

    const guildChannel = interaction.guild!.channels.cache.get(channel) as TextChannel;

    await guildChannel.send({
        embeds:[embed],
        components:[row]
    });

    const lastMessageId = guildChannel.lastMessageId;

    await Buttons.create({
        buttonId: createCommissionButtonId,
        channelId: channel,
        messageId: lastMessageId,
        buttonType: EButtonType.CreateCommission
    });

    await Buttons.create({
        buttonId: helpCommissionButtonId,
        channelId: channel,
        messageId: lastMessageId,
        buttonType: EButtonType.CommissionHelp
    });

    await interaction.reply({
        content: "Created commissions channel.",
        flags: "Ephemeral"
    });
}