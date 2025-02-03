import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    Interaction,
    ModalSubmitInteraction,
    TextChannel,
    ThreadAutoArchiveDuration
} from "discord.js";
import {randomUUID} from "crypto";
import {Commission} from "../../classes/commissions/commission.class";
import {COMMISSIONS_CHANNEL_ID} from "../../environment";
import {CommissionChannel} from "../../classes/commissions/commission.channel.class";
import {CommissionOwner} from "../../classes/commissions/commission.owner.class";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";

export const data = new DiscordInteraction()
    .setName("createCommission");

export async function execute(modal: ModalSubmitInteraction, interaction: Interaction) {
    const commission_name = modal.fields.getTextInputValue("commission_name") as string;
    const commission_budget = modal.fields.getTextInputValue("commission_budget") as string;
    const commission_due_date = modal.fields.getTextInputValue("commission_due_date") as string;
    const commission_details = modal.fields.getTextInputValue("commission_details") as string;
    const commission_id = randomUUID().toString();
    const dateParts = commission_due_date.split("/");

    const commission = await Commission.create({
        commissionId: commission_id,
        commissionName: commission_name,
        commissionBudget: commission_budget,
        commissionDueDate: new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`)
    });

    const channel = interaction.guild!.channels.cache.get(COMMISSIONS_CHANNEL_ID as string) as TextChannel;
    const thread = await channel.threads.create({
        name: `Commission-${commission.commissionNumber}`,
        reason: `New Commission: ${commission.commissionNumber}`,
        type: ChannelType.PrivateThread,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        invitable: false
    });

    const commissionInfo = new EmbedBuilder()
        .setTitle(`Commission-${commission.commissionNumber}`)
        .setFields(
            {name: "Commission Name", value: commission_name},
            {name: "Commission Budget", value: commission_budget},
            {name: "Commission Due Date", value: commission_due_date},
            {name: "Commission Status", value: commission.commissionStatus}
        );

    const commissionDetails = new EmbedBuilder()
        .setTitle(`Commission-${commission.commissionNumber} Details`)
        .setDescription(commission_details);

    const acceptCommissionButtonId = randomUUID().toString();
    const acceptCommission = new ButtonBuilder()
        .setEmoji("✔️")
        .setCustomId(`AcceptCommission-${acceptCommissionButtonId}`)
        .setLabel("Accept Commission")
        .setStyle(ButtonStyle.Success);

    const closeCommissionButtonId = randomUUID().toString();
    const closeCommission = new ButtonBuilder()
        .setEmoji("✖️")
        .setCustomId(`CancelCommission-${closeCommissionButtonId}`)
        .setLabel("Reject Commission")
        .setStyle(ButtonStyle.Danger);

    const commissionButtons = new ActionRowBuilder<ButtonBuilder>({
        components: [
            acceptCommission,
            closeCommission
        ]
    });

    await thread.send({
        embeds: [commissionInfo, commissionDetails],
        components: [commissionButtons]
    });

    const lastMessageId = thread.lastMessageId;

    await Buttons.create({
        buttonId: acceptCommissionButtonId,
        channelId: COMMISSIONS_CHANNEL_ID as string,
        messageId: lastMessageId!,
        buttonType: EButtonType.AcceptCommission
    });

    await Buttons.create({
        buttonId: closeCommissionButtonId,
        channelId: COMMISSIONS_CHANNEL_ID as string,
        messageId: lastMessageId!,
        buttonType: EButtonType.RejectCommission
    });

    await CommissionChannel.create({
        id: randomUUID().toString(),
        channelId: COMMISSIONS_CHANNEL_ID,
        baseMessageId: lastMessageId!,
        commissionId: commission.commissionId,
    });

    await CommissionOwner.create({
        ownerId: randomUUID().toString(),
        ownerDiscordId: interaction.user.id,
        commissionId: commission.commissionId,
    });

    await thread.members.add(interaction.user.id);

    await modal.reply({
        content: `Created your commission at: ${thread.url}`,
        flags: "Ephemeral"
    });
}