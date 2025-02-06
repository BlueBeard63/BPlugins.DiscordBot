import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    EmbedBuilder,
    Interaction,
    PrivateThreadChannel,
    time,
    TimestampStyles
} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";
import {COMMISSIONS_DEV_ROLE_ID} from "../../environment";
import {Commission} from "../../classes/commissions/commission.class";
import {randomUUID} from "crypto";
import {ButtonExtra} from "../../classes/interactions/buttons/button.extra";
import {ECommissionStatus} from "../../classes/commissions/ECommissionStatus";
import {GetCommissionChannelAndCommission} from "../../helpers/gatherButtonsData";

export const data = new DiscordInteraction()
    .setName(EButtonType.AcceptCommission);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const guildMember = interaction.guild!.members.cache.get(interaction.user.id)!;

    await guildMember.guild.roles.fetch();

    if (!guildMember.roles.cache.hasAny(COMMISSIONS_DEV_ROLE_ID)) {
        await button.reply({
            content: "You do not have permission to accept a commission on behalf of BlueBeard63.",
            flags: "Ephemeral"
        });

        return;
    }

    const {commission, commissionChannel, error} = await GetCommissionChannelAndCommission(databaseButton);

    if (error !== "") {
        await button.reply({
            content: error,
            flags: "Ephemeral"
        });

        return;
    }

    const acceptedCommission = new EmbedBuilder()
        .setTitle(`Commission-${commission!.commissionNumber} Accepted`)
        .setFields(
            {name: "Accepted At", value: time(new Date(new Date().toUTCString()), TimestampStyles.LongDateTime)},
            {name: "Accepted By", value: "BlueBeard63"}
        );

    await button.reply({
        embeds: [acceptedCommission],
    });

    const changeStatusButtonId = randomUUID().toString();
    const changeStatus_button = new ButtonBuilder()
        .setCustomId(EButtonType.ChangeStatus + "-" + changeStatusButtonId)
        .setLabel("Change Commission Status")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("✏️");

    const cancelCommissionButtonId = randomUUID().toString();
    const cancel_button = new ButtonBuilder()
        .setCustomId(EButtonType.CloseCommission + "-" + cancelCommissionButtonId)
        .setLabel("Cancel Commission")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🗑️");

    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [changeStatus_button, cancel_button],
    })

    const thread = interaction.guild!.channels.cache.get(commissionChannel!.channelId) as PrivateThreadChannel;
    await thread.messages.cache.get(commissionChannel!.baseMessageId)!.edit({
        components: [row]
    });

    await Commission.update({
        commissionStatus: ECommissionStatus.Accepted,
    }, {
        where: {
            commissionId: commission!.commissionId
        }
    });

    const extraData = new ButtonExtra();
    extraData.linkedCommissionId = commission!.commissionId;

    // Get rid of the old buttons in the database as they have been replaced
    await Buttons.destroy({
        where: {
            channelId: thread.id,
            messageId: commissionChannel!.baseMessageId!,
        }
    });

    // Insert the new buttons into the database for the thread message when the commission has been accepted
    await Buttons.create({
        buttonId: changeStatusButtonId,
        channelId: thread.id,
        messageId: commissionChannel!.baseMessageId!,
        buttonType: EButtonType.ChangeStatus,
        buttonExtraData: JSON.stringify(extraData)
    });

    await Buttons.create({
        buttonId: cancelCommissionButtonId,
        channelId: thread.id,
        messageId: commissionChannel!.baseMessageId!,
        buttonType: EButtonType.ChangeStatus,
        buttonExtraData: JSON.stringify(extraData)
    });
}