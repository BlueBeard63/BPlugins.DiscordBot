import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";
import { Product } from "./purchase.product.class";

export class Purchase extends Model {
    declare purchaseId: number;
    declare transcationId: string;
    declare productDigitalId: string;
    declare purchaseClaimed: boolean;
}

Purchase.init({
    purchaseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    transcationId: {        
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unknown'
    },
    productDigitalId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    purchaseClaimed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: false,

    paranoid: true,

    tableName: 'purchase'
});

Product.hasMany(Purchase, {
    sourceKey: "productDigitalId",
    foreignKey: "productDigitalId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});