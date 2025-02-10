import {AnySelectMenuInteraction, CacheType, Interaction} from "discord.js";

export async function dealWithSelectionMenu(interaction: Interaction<CacheType>) {
    const menu = interaction as AnySelectMenuInteraction;
    const menuId = menu.customId;

    const menuType = menuId.split("-")[0];
}