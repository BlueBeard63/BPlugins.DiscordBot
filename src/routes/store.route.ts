import { Router } from "express";
import { StoreController } from "../controllers/store.controller";

class StoreRoutes {
    router = Router();
    
    constructor() {
        this.initRoutes();
    }
    
    initRoutes(){
        this.router.post("/purchase", StoreController.addPurchase);
    }
}

export default new StoreRoutes().router;