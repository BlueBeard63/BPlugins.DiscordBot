import {Commission} from "../classes/commissions/commission.class";
import {CommissionChannel} from "../classes/commissions/commission.channel.class";
import {Buttons} from "../classes/interactions/buttons/button.interaction.class";

export async function GetCommissionChannelAndCommission(databaseButton: Buttons): Promise<{
    commission: Commission | null,
    commissionChannel: CommissionChannel | null,
    error: string
}> {
    const commission_id = databaseButton.extraData.linkedCommissionId;

    if (commission_id === "" || commission_id === undefined) {
        return {
            commission: null,
            commissionChannel: null,
            error: "Error Commission, buttons linkedCommissionId is empty or undefined."
        };
    }

    const commission = await Commission.findOne({
        where: {
            commissionId: commission_id
        }
    });

    if (commission === null) {
        return {
            commission: null,
            commissionChannel: null,
            error: "Error Commission, commission was null when fetched from database."
        };
    }

    const commission_channel = await CommissionChannel.findOne({
        where: {
            commissionId: commission_id
        }
    });

    if (commission_channel === null) {
        return {
            commission: null,
            commissionChannel: null,
            error: "Error Commission, commission_channel was null when fetched from database."
        };
    }

    return {
        commission: commission,
        commissionChannel: commission_channel,
        error: ""
    };
}

export async function GetCommissionChannelAndCommissionFromString(channelId: string) : Promise<{
    commission: Commission | null,
    commissionChannel: CommissionChannel | null,
    error: string
}> {
    const commission = await Commission.findOne({
        where: {
            channelId: channelId
        }
    });

    if (commission === null) {
        return {
            commission: null,
            commissionChannel: null,
            error: "Error Commission, channelId was not a valid commission thread id."
        };
    }

    const commission_channel = await CommissionChannel.findOne({
        where: {
            channelId: channelId
        }
    });

    if (commission_channel === null) {
        return {
            commission: null,
            commissionChannel: null,
            error: "Error Commission, commission_channel was null when fetched from database."
        };
    }

    return {
        commission: commission,
        commissionChannel: commission_channel,
        error: ""
    };
}