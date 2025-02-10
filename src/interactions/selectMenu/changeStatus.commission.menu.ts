import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {AnySelectMenuInteraction, EmbedBuilder, Interaction, PrivateThreadChannel} from "discord.js";
import {COMMISSIONS_DEV_ROLE_ID} from "../../environment";
import {GetCommissionChannelAndCommissionFromString} from "../../helpers/gatherButtonsData";
import {Commission} from "../../classes/commissions/commission.class";
import {Logger} from "../../logger";

export const data = new DiscordInteraction()
    .setName("setChangeStatus");

export async function execute(menu: AnySelectMenuInteraction, interaction: Interaction) {
    const menuCommissionChannelId = menu.channelId;
    console.log(`Line 12 | Channel Id: ${menuCommissionChannelId}`)
    const guildMember = interaction.guild?.members.cache.get(interaction.user.id)!;

    await guildMember.guild.roles.fetch();

    if (!guildMember.roles.cache.hasAny(COMMISSIONS_DEV_ROLE_ID)) {
        await menu.reply({
            content: "You do not have permission to accept a commission on behalf of BlueBeard63.",
            flags: "Ephemeral"
        });

        return;
    }

    const {
        commission,
        commissionChannel,
        error
    } = await GetCommissionChannelAndCommissionFromString(menuCommissionChannelId);

    if (error !== "") {
        await menu.reply({
            content: error,
            flags: "Ephemeral"
        });

        return;
    }

    const value = menu.values[0];
    await Commission.update({
        commissionStatus: value
    }, {
        where: {
            commissionId: commission?.commissionId
        }
    });

    const oldCommissionStatus = commission?.commissionStatus.toString().split(/(?=[A-Z])/).join(" ")!;
    const newCommissionStatus = value.split(/(?=[A-Z])/).join(" ")!;

    const embed = new EmbedBuilder()
        .setTitle("Changed Status")
        .addFields(
            {name: "Commission Id:", value: `${commission?.commissionId}`},
            {name: "Old Status:", value: oldCommissionStatus},
            {name: "New Status:", value: newCommissionStatus}
        );

    await menu.reply({
        embeds: [embed],
        flags: 'Ephemeral',
    });

    const thread = menu.guild?.channels.cache.get(commissionChannel?.channelId!) as PrivateThreadChannel;
    await thread.send({
        embeds: [embed]
    });

    const commissionEmbed = new EmbedBuilder()
        .setTitle(`Commission-${commission?.commissionNumber}`)
        .setFields(
            {name: "Commission Name", value: `${commission!.commissionName}` },
            {name: "Commission Budget", value: `${commission!.commissionBudget}` },
            {name: "Commission Due Date", value: `${commission!.commissionDueDate}` },
            {name: "Commission Status", value: newCommissionStatus }
        );
    
    const commissionDetails = new EmbedBuilder()
        .setTitle(`Commission-${commission!.commissionNumber} Details`)
        .setDescription(commission!.commissionDetails);
    
    await thread.messages.fetch();
    const message = thread.messages.cache.get(commissionChannel?.baseMessageId!);
    
    if (message === undefined) {
        Logger.LogError("Message from cache was undefined");
        return;
    }
    
    await message!.edit({
        embeds: [commissionEmbed, commissionDetails],
    });
}