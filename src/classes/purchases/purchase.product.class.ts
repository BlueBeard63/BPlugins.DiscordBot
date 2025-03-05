import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";
import { Purchase } from "./purchase.class";

export class Product extends Model {
    declare productDigitalId: string;
    declare productName: string;
    declare productUrl: string;
}

Product.init({
    productDigitalId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }  
}, {
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: false,

    paranoid: true,

    tableName: 'products'
});

Product.hasMany(Purchase, {
    sourceKey: "productDigitalId",
    foreignKey: "productDigitalId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});