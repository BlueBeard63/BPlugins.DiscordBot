import * as add_user from "./addUser.command"
import * as remove_user from "./removeUser.command"
import * as send_commission_message from "./sendCommissionMessage"
import * as add_reaction_role from "./addReactionRole.command"
import * as remove_reaction_role from "./removeReactionRole.command"

export const commands = {
    add_user,
    remove_user,
    send_commission_message,
    add_reaction_role,
    remove_reaction_role
};