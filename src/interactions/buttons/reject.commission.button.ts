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
import {COMMISSIONS_DEV_ROLE_ID} from "../../environment";

export const data = new DiscordInteraction()
    .setName(EButtonType.RejectCommission);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const guildMember = interaction.guild!.members.cache.get(interaction.user.id)!;

    await guildMember.guild.roles.fetch();
    
    if(!guildMember.roles.cache.has(COMMISSIONS_DEV_ROLE_ID)){
        await button.reply({
            content: "You do not have permission to reject a commission on behalf of BlueBeard63.",
            flags: "Ephemeral"
        });

        return;
    }

    const model = new ModalBuilder()
        .setCustomId(`rejectCommission-${databaseButton.extraData.linkedCommissionId}`)
        .setTitle("Reject Commission");

    const reason = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Reason of Rejection")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const commission_rejected_reason = new ActionRowBuilder<TextInputBuilder>().addComponents(reason);

    model.addComponents([commission_rejected_reason]);
    await button.showModal(model);
}