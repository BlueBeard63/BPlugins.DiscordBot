import {DiscordInteraction} from "../../classes/interactions/discordInteraction";
import {EButtonType} from "../../classes/interactions/buttons/EButtonType";
import {ButtonInteraction, Interaction} from "discord.js";
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

    // TODO
}