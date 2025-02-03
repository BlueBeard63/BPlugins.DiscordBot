import {
    CacheType,
        Interaction,
        ButtonInteraction,
} from "discord.js";
import {buttons} from "./buttons";
import {Buttons} from "../classes/interactions/buttons/button.interaction.class";

export async function dealWithButton(interaction: Interaction<CacheType>) {
    const button = interaction as ButtonInteraction;

    const buttonId = button.customId.split("-").filter((_, i) => i !== 0).join("-");
    const guildId = interaction.guild!.id;
    const messageId = button.message.id;
    const channelId = interaction.channel!.id;

    if (await Buttons.doesButtonExist(buttonId, channelId, messageId)) {
        const databaseButton = await Buttons.getButton(buttonId, channelId, messageId);

        if (buttons.map(x => x.data.name).includes(databaseButton.buttonType)) {
            await buttons.find(y => y.data.name === databaseButton.buttonType)!.execute({
                guildId,
                buttonId,
                messageId,
                channelId
            }, interaction, button, databaseButton);
            return;
        }
    }

    await button.reply({
        content: "We could not find the button in our database please contact BlueBeard63!",
        flags: "Ephemeral"
    });
}