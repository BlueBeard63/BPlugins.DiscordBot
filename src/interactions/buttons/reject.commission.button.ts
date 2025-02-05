import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {ButtonInteraction, Interaction} from "discord.js";
import {Buttons} from "../../classes/interactions/buttons/button.interaction.class";

export const data = new DiscordInteraction()
    .setName(EButtonType.RejectCommission);

export async function execute(genericInfo: {
    guildId: string,
    buttonId: string,
    messageId: string,
    channelId: string
}, interaction: Interaction, button: ButtonInteraction, databaseButton: Buttons) {
}