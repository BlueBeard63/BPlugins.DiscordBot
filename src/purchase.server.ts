import express, {Application} from 'express';
import { KofiServerPort } from './environment';
import { Logger } from './logger';
import bodyParser from 'body-parser';

import storeRoute from './routes/store.route';
import productRoute from './routes/product.route';

export class PurchaseServer {    
    constructor(){
        const app: Application = express();

        app.use(bodyParser.json());
        app.use(express.urlencoded({ extended: true }));

        app.use("/api/store", storeRoute);
        app.use("/api/product", productRoute)

        app.listen(KofiServerPort, () => {
            Logger.LogInfo(`Kofi Websocket Server Running at: ${KofiServerPort}`);
        });
    }
}
