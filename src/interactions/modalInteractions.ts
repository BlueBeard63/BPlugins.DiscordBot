import {
    CacheType,
    Interaction,
    ModalSubmitInteraction,
} from "discord.js";
import {modals} from "./models";

export async function dealWithModel(interaction: Interaction<CacheType>) {
    const modal = interaction as ModalSubmitInteraction;
    const modalId = modal.customId;
    const modalType = modalId.split("-")[0];

    if (modals.map(x => x.data.name).includes(modalType)) {
        await modals.find(y => y.data.name === modalType)!.execute(modal, interaction);
        return;
    }
}