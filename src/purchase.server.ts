import express, {Application, Request, Response} from 'express';
import { KofiServerPort, KofiVerificationToken } from './environment';
import { Logger } from './logger';
import bodyParser from 'body-parser';
import { Purchase } from './classes/purchases/purchase.class';
import { randomUUID } from 'crypto';

export class PurchaseServer {    
    constructor(){
        const app: Application = express();

        app.use(bodyParser.json());
        app.use(express.urlencoded({ extended: true }));
        app.post("/api/store/purchase", async (req: Request, res: Response) => {
            const supportWebhookData = JSON.parse(req.body.data);

            if(supportWebhookData.type !== 'Shop Order'){
                Logger.LogWarning(`Ignoring Webhook From Order Due to type: ${supportWebhookData.type}`);
                res.sendStatus(200); 
                return;
            }

            if(supportWebhookData.verification_token !== KofiVerificationToken) {
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
        });

        app.listen(KofiServerPort, () => {
            Logger.LogInfo(`Kofi Websocket Server Running at: ${KofiServerPort}`);
        });
    }
}
