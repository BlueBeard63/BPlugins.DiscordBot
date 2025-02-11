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
import {COMMISSIONS_DEV_ROLE_ID} from "../../environment";

export const data = new DiscordInteraction()
    .setName("rejectCommission");


export async function execute(modal: ModalSubmitInteraction, interaction: Interaction) {
    const guildMember = interaction.guild!.members.cache.get(interaction.user.id)!;

    await guildMember.guild.roles.fetch();

    if(!guildMember.roles.cache.hasAny(COMMISSIONS_DEV_ROLE_ID)){
        await modal.reply({
            content: "You do not have permission to accept a commission on behalf of BlueBeard63.",
            flags: "Ephemeral"
        });

        return;
    }

    const modalId = modal.customId;
    const commissionId = modalId.replace("rejectCommission-", "");
    
    let closeMessage = modal.fields.getTextInputValue("reason") as string;

    if(closeMessage === "") {
        closeMessage = "No rejection message has been provided!";
    }

    const commission = await Commission.findOne({
        where: {
            commissionId: commissionId
        }
    });

    if(commission === null) {
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

    if(commission_channel === null) {
        await modal.reply({
            content: "Error Commission, commission_channel was null when fetched from database.",
            flags: "Ephemeral"
        });

        return;
    }

    const rejectedCommission = new EmbedBuilder()
        .setTitle(`Commission-${commission.commissionNumber} Rejected`)
        .setFields(
            {name: "Rejected Reason", value: closeMessage},
            {name: "Rejected At", value: time(new Date(new Date().toUTCString()), TimestampStyles.LongDateTime)},
            {name: "Rejected By", value: "BlueBeard63"}
        );

    await modal.reply({
        embeds: [rejectedCommission],
    });

    const thread = interaction.guild!.channels.cache.get(commission_channel.channelId) as PrivateThreadChannel;
    await thread.messages.cache.get(commission_channel!.baseMessageId)!.edit({
        components: []
    });

    await Commission.update({
        commissionStatus: ECommissionStatus.Rejected,
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
    
    await thread.setLocked(true, "Commission was Rejected");
}