import {AnySelectMenuInteraction, CacheType, Interaction} from "discord.js";
import {modals} from "./models";
import {selectMenus} from "./selectMenu";

export async function dealWithSelectionMenu(interaction: Interaction<CacheType>) {
    const menu = interaction as AnySelectMenuInteraction;
    const menuId = menu.customId;

    const menuType = menuId.split("-")[0];
    if (selectMenus.map(x => x.data.name).includes(menuType)) {
        await selectMenus.find(y => y.data.name === menuType)!.execute(menu, interaction);
        return;
    }
}