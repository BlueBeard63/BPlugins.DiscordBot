import {
    SlashCommandBuilder,
    CommandInteraction,
    EmbedBuilder,
    PrivateThreadChannel
} from "discord.js";
import {Commission} from "../classes/commissions/commission.class";
import {CommissionOwner} from "../classes/commissions/commission.owner.class";
import {randomUUID} from "crypto";
import {CommissionChannel} from "../classes/commissions/commission.channel.class";

export const data = new SlashCommandBuilder()
    .setName("add_user")
    .setDescription("Adds a user to the commission thread.")
    .addUserOption(option => option
        .setName("user")
        .setDescription("The user to add a user to the commission thread.")
        .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const user = interaction.options.get("user")!.value as string;

    if(await CommissionChannel.count({
        where: {
            channelId: interaction.channelId
        }
    }) === 0){
        const embed = new EmbedBuilder()
            .setTitle(`Error:`)
            .setDescription(`Please call this command in a commission thread otherwise it will not work!`)

        return interaction.reply({
            embeds: [embed],
            flags: "Ephemeral",
        });
    }

    const commission = await CommissionChannel.findOne({
        where: {
            channelId: interaction.channelId
        }
    });

    if(commission){
        const commissionId = commission.commissionId;

        await CommissionOwner.create({
            ownerId: randomUUID().toString(),
            ownerDiscordId: user,
            commissionId: commissionId
        });

        const embed = new EmbedBuilder()
            .setTitle(`Add User:`)
            .setDescription(`You have now added <@${user}> to the commission thread.`);

        const thread = interaction.guild!.channels.cache.get(interaction.channelId) as PrivateThreadChannel;
        await thread.members.add(user);

        return interaction.reply({
            embeds: [embed]
        });
    }

    const embed = new EmbedBuilder()
        .setTitle(`Error:`)
        .setDescription(`Commission was null, please contact BlueBeard about this issue.`)

    return interaction.reply({
        embeds: [embed],
        flags: "Ephemeral",
    });
}