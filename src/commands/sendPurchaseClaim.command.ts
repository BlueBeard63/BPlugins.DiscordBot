import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle, ChannelType,
    CommandInteraction,
    EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder, TextChannel
} from "discord.js";
import { randomUUID } from "crypto";
import { Buttons } from "../classes/interactions/buttons/button.interaction.class";
import { EButtonType } from "../classes/interactions/buttons/EButtonType";

export const data = new SlashCommandBuilder()
    .setName("send_purchase_claim")
    .setDescription("Sends the purchase claim message")
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the claim purchase embed in.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    const channel = interaction.options.get("channel")!.value as string;

    const embed = new EmbedBuilder()
        .setTitle("Purchases")
        .setDescription("To claim a purchase please press the button below, and provide the relivent information required in the modal that will appear.");

    const claimPurchaseButtonId = randomUUID().toString();
    const claimPurchaseButton = new ButtonBuilder()
        .setCustomId(`ClaimPurchase-${claimPurchaseButtonId}`)
        .setEmoji("🛒")
        .setLabel("Claim Purchase")
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [
            claimPurchaseButton
        ]
    });

    const guildChannel = interaction.guild!.channels.cache.get(channel) as TextChannel;

    await guildChannel.send({
        embeds:[embed],
        components:[row]
    });

    const lastMessageId = guildChannel.lastMessageId;

    await Buttons.create({
        buttonId: claimPurchaseButtonId,
        channelId: channel,
        messageId: lastMessageId,
        buttonType: EButtonType.ClaimPurchase
    });

    await interaction.reply({
        content: "Created claim purchase channel.",
        flags: "Ephemeral"
    });
}