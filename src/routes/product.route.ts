import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

class ProductRoutes {
    router = Router();
    
    constructor() {
        this.initRoutes();
    }
    
    initRoutes(){
        this.router.get("/allowed/:serverIp/:liscenseKey", ProductController.isWhitelisted);
        this.router.get("/create/:serverIp/:liscenseKey", ProductController.addWhitelist);
    }
}

export default new ProductRoutes().router;