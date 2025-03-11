import { Request, Response } from "express";
import { PurchaseClaim } from "../classes/purchases/purchase.claim.class";
import { Purchase } from "../classes/purchases/purchase.class";
import { Product } from "../classes/purchases/purchase.product.class";
import { WhitelistedProducts } from "../classes/purchases/product.whitelist.class";

export class ProductController {
    public static async isWhitelisted(req: Request, res: Response): Promise<any> {
        const serverIp = req.params.serverIp;
        const liscenseKey = req.params.liscenseKey;

        let productName = "Unknown";

        if (await PurchaseClaim.count({
            where: {
                usageKey: liscenseKey
            }
        }) == 0) {
            return res.status(400).json({
                whitelisted: false,
                productName: productName,
                error: true,
                message: "Unknown Liscense Key!"
            });
        }

        const purchaseClaim = await PurchaseClaim.findOne({
            where: {
                usageKey: liscenseKey
            }
        });

        productName = await ProductController.getProductName(purchaseClaim!);

        if (await WhitelistedProducts.count({
            where: {
                serverIp: serverIp,
                claimId: purchaseClaim?.claimId
            }
        }) == 0) {
            return res.status(400).json({
                whitelisted: false,
                productName: productName,
                error: true,
                message: "No whitelist found with serverIp for product requested!"
            });
        }

        return res.status(200).json({
            whitelisted: true,
            productName: productName,
            error: false,
            message: ""
        });
    }

    private static async getProductName(purchaseClaim: PurchaseClaim): Promise<string> {
        const purchase = await Purchase.findOne({
            where: {
                purchaseId: purchaseClaim?.purchaseId
            }
        });

        const product = await Product.findOne({
            where: {
                productDigitalId: purchase?.productDigitalId
            }
        });

        return product?.productName!;
    }

    // Not to be implemented till website built
    public static async removeWhitelist(req: Request, res: Response): Promise<any> {
    }

    public static async addWhitelist(req: Request, res: Response): Promise<any> {
        const serverIp = req.params.serverIp;
        const liscenseKey = req.params.liscenseKey;

        let productName = "Unknown";

        if (await PurchaseClaim.count({
            where: {
                usageKey: liscenseKey
            }
        }) == 0) {
            return res.status(400).json({
                created: false,
                productName: productName,
                error: true,
                message: "Unknown Liscense Key!"
            });
        }

        const purchaseClaim = await PurchaseClaim.findOne({
            where: {
                usageKey: liscenseKey
            }
        });

        productName = await ProductController.getProductName(purchaseClaim!);

        if(await WhitelistedProducts.count({
            where: {
                serverIp: serverIp,
                claimId: purchaseClaim?.claimId
            }
        }) != 0){
            return res.status(400).json({
                created: false,
                productName: productName,
                error: true,
                message: "Whitelist already exists for this serverIp and product!"
            });
        }

        await WhitelistedProducts.create({
            serverIp: serverIp,
            claimId: purchaseClaim?.claimId
        });

        return res.status(200).json({
            created: true,
            productName: productName,
            error: false,
            message: ""
        });
    }

    // Not to be implemented till website built
    public static async howManyWhitelisted(req: Request, res: Response): Promise<any> {
    }
}