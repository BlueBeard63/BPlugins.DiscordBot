import express, {Application, Request, Response} from 'express';
import { KofiServerPort } from './environment';
import { Logger } from './logger';
import bodyParser from 'body-parser';

export class PurchaseServer {    
    constructor(){
        const app: Application = express();

        app.use(bodyParser.urlencoded({ extended: true }));
        app.post("/api/store/purchase", async (req: Request, res: Response) => {
            Logger.LogWarning("Kofi Purchase");
            Logger.LogWarning(req.body);

            res.sendStatus(200); 
        });

        app.listen(KofiServerPort, () => {
            Logger.LogInfo(`Kofi Websocket Server Running at: ${KofiServerPort}`);
        });
    }
}
