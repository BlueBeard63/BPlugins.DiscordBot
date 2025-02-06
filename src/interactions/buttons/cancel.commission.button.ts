import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {ButtonInteraction, Interaction} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";
import {GetCommissionChannelAndCommission} from "../../helpers/gatherButtonsData";

export const data = new DiscordInteraction()
    .setName(EButtonType.CloseCommission);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
    const {commission, commissionChannel, error} = await GetCommissionChannelAndCommission(databaseButton);

    if (error !== "") {
        await button.reply({
            content: error,
            flags: "Ephemeral"
        });

        return;
    }
    // TODO
}