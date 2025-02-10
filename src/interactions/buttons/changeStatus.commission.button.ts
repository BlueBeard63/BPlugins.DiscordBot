import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {
    ActionRowBuilder,
    ButtonInteraction,
    EmbedBuilder,
    Interaction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";
import {GetCommissionChannelAndCommission} from "../../helpers/gatherButtonsData";
import {COMMISSIONS_DEV_ROLE_ID} from "../../environment";

export const data = new DiscordInteraction()
    .setName(EButtonType.ChangeStatus);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const guildMember = interaction.guild?.members.cache.get(interaction.user.id)!;

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

    const embed = new EmbedBuilder()
        .setTitle("Change Status")
        .setDescription(`Changes the status for the Commission-${commission?.commissionId}.`);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`setChangeStatus-${commission?.commissionId}`)
        .setPlaceholder("Please select commission status")
        .addOptions(new StringSelectMenuOptionBuilder()
            .setValue("Pending")
            .setLabel("Pending")
            .setDescription("The commission is being set to pending start but has not been started yet.")
        )
        .addOptions(new StringSelectMenuOptionBuilder()
            .setValue("NotStarted")
            .setLabel("Not Started")
            .setDescription("Commission is being planned but has not started programming stage yet.")
        )
        .addOptions(new StringSelectMenuOptionBuilder()
            .setValue("InProgress")
            .setLabel("In Progress")
            .setDescription("The commission is in progress of being made and has updates associated with it.")
        )
        .addOptions(new StringSelectMenuOptionBuilder()
            .setValue("Completed")
            .setLabel("Completed")
            .setDescription("The commission has been completed and is awaiting confirmation of completion by owner of commission..")
        );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu)

    await button.reply({
        embeds: [embed],
        components: [row],
        flags: 'Ephemeral'
    });
}