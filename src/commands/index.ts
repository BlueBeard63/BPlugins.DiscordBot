import * as add_user from "./addUser.command"
import * as remove_user from "./removeUser.command"
import * as send_commission_message from "./sendCommissionMessage"
import * as add_reaction from "./addReactionRole.command"
import * as remove_reaction from "./removeReactionRole.command"
import * as send_purchase_claim from "./sendPurchaseClaim.command"
import * as add_product from "./addProduct.command";

export const commands = {
    add_user,
    remove_user,
    send_commission_message,
    add_reaction,
    remove_reaction,
    send_purchase_claim,
    add_product
};