import { Request, Response } from "express";
import { Purchase } from "../classes/purchases/purchase.class";
import { Logger } from "../logger";
import { KofiVerificationToken } from "../environment";

export class StoreController {
    public static async addPurchase(req: Request, res: Response): Promise<any> {
        const supportWebhookData = JSON.parse(req.body.data);

        if (supportWebhookData.type !== 'Shop Order') {
            Logger.LogWarning(`Ignoring Webhook From Order Due to type: ${supportWebhookData.type}`);
            res.sendStatus(200);
            return;
        }

        if (supportWebhookData.verification_token !== KofiVerificationToken) {
            Logger.LogWarning(`Ignoring Webhook From Order Due to incorrect verification token: ${supportWebhookData.verification_token}`);
            res.sendStatus(200);
            return;
        }

        supportWebhookData.shop_items.forEach(async (item: any) => {
            await Purchase.create({
                transcationId: supportWebhookData.kofi_transaction_id,
                productDigitalId: item.direct_link_code
            });
        });

        res.sendStatus(200);
    }
}