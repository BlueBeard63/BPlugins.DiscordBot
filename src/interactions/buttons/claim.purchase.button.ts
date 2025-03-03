import { ActionRowBuilder, ButtonInteraction, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { EButtonType } from "../../classes/interactions/buttons/EButtonType";
import { DiscordInteraction } from "../../classes/interactions/discordInteraction";
import { Buttons } from "../../classes/interactions/buttons/button.interaction.class";

export const data = new DiscordInteraction()
    .setName(EButtonType.ClaimPurchase);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) 
{
    const model = new ModalBuilder()
        .setTitle("Claim Purchase")
        .setCustomId("claim-purchase");

    const purchaseReferenceId = new TextInputBuilder()
            .setCustomId("purchase_reference_id")
            .setLabel("Reference Id From Store Purchase")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
    
    const purchaseReferenceId_row = new ActionRowBuilder<TextInputBuilder>().addComponents(purchaseReferenceId);

    model.addComponents(purchaseReferenceId_row)

    await button.showModal(model);
}