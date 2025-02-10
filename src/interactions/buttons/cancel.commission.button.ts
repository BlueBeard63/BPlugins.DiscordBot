import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {
    ActionRowBuilder,
    ButtonInteraction,
    Interaction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";
import {GetCommissionChannelAndCommission} from "../../helpers/gatherButtonsData";

export const data = new DiscordInteraction()
    .setName(EButtonType.CloseCommission);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const {commission, commissionChannel, error} = await GetCommissionChannelAndCommission(databaseButton);

    if (error !== "") {
        await button.reply({
            content: error,
            flags: "Ephemeral"
        });

        return;
    }
    
    const model = new ModalBuilder()
        .setCustomId(`cancelCommission-${databaseButton.extraData.linkedCommissionId}`)
        .setTitle("Cancel Commission");

    const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason of Cancellation")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const commission_cancellation_reason = new ActionRowBuilder<TextInputBuilder>().addComponents(reason);

    model.addComponents([commission_cancellation_reason]);
    await button.showModal(model);
}