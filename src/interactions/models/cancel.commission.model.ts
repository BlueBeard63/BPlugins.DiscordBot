import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {
    EmbedBuilder,
    Interaction,
    ModalSubmitInteraction,
    PrivateThreadChannel,
    time,
    TimestampStyles
} from "discord.js";
import {CommissionChannel} from "../../classes/commissions/commission.channel.class";
import {Commission} from "../../classes/commissions/commission.class";
import {ECommissionStatus} from "../../classes/commissions/ECommissionStatus";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";

export const data = new DiscordInteraction()
    .setName("cancelCommission");

export async function execute(modal: ModalSubmitInteraction, interaction: Interaction) {
    const modalId = modal.customId;
    const commissionId = modalId.replace("cancelCommission-", "");

    let cancelMessage = modal.fields.getTextInputValue("reason") as string;

    if (cancelMessage === "") {
        cancelMessage = "No cancellation message has been provided!";
    }

    const commission = await Commission.findOne({
        where: {
            commissionId: commissionId
        }
    });

    if (commission === null) {
        await modal.reply({
            content: "Error Commission, commission was null when fetched from database.",
            flags: "Ephemeral"
        });

        return;
    }

    const commission_channel = await CommissionChannel.findOne({
        where: {
            commissionId: commission.commissionId
        }
    });

    if (commission_channel === null) {
        await modal.reply({
            content: "Error Commission, commission_channel was null when fetched from database.",
            flags: "Ephemeral"
        });

        return;
    }

    const rejectedCommission = new EmbedBuilder()
        .setTitle(`Commission-${commission.commissionNumber} Cancelled`)
        .setFields(
            {name: "Cancellation Reason", value: cancelMessage},
            {name: "Cancelled At", value: time(new Date(new Date().toUTCString()), TimestampStyles.LongDateTime)},
            {name: "Cancelled By", value: modal.user.displayName}
        );

    await modal.reply({
        embeds: [rejectedCommission],
    });

    const thread = interaction.guild!.channels.cache.get(commission_channel.channelId) as PrivateThreadChannel;
    await thread.messages.cache.get(commission_channel!.baseMessageId)!.edit({
        components: []
    });

    await Commission.update({
        commissionStatus: ECommissionStatus.Canceled,
    }, {
        where: {
            commissionId: commission.commissionId
        }
    });

    await Buttons.destroy({
        where: {
            channelId: thread.id,
            messageId: commission_channel.baseMessageId!,
        }
    });

    await thread.setLocked(true, "Commission was Cancelled");
}