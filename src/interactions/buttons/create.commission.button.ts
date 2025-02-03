import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {
    ActionRowBuilder,
    ButtonInteraction,
    Interaction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";

export const data = new DiscordInteraction()
    .setName("CreateCommission");

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const model = new ModalBuilder()
        .setCustomId(`createCommission`)
        .setTitle("Create A Commission");

    const commission_name = new TextInputBuilder()
        .setCustomId("commission_name")
        .setLabel("Name of the Commission")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const commission_budget = new TextInputBuilder()
        .setCustomId("commission_budget")
        .setLabel("Budget for the Commission")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const commission_details = new TextInputBuilder()
        .setCustomId("commission_details")
        .setLabel("Details of the Commission")
        .setPlaceholder("Please include any relevant information such as commands.")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const commission_due_date = new TextInputBuilder()
        .setCustomId("commission_due_date")
        .setLabel("Due date for commission")
        .setPlaceholder("Please use format: DD/MM/YYYY")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const commission_name_row = new ActionRowBuilder<TextInputBuilder>().addComponents(commission_name);
    const commission_budget_row = new ActionRowBuilder<TextInputBuilder>().addComponents(commission_budget);
    const commission_details_row = new ActionRowBuilder<TextInputBuilder>().addComponents(commission_details);
    const commission_due_date_row = new ActionRowBuilder<TextInputBuilder>().addComponents(commission_due_date);

    model.addComponents(commission_name_row, commission_budget_row, commission_due_date_row, commission_details_row);

    await button.showModal(model);
}