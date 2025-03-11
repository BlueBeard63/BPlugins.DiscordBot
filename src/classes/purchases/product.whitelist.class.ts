import { DataTypes, literal, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";
import { PurchaseClaim } from "./purchase.claim.class";

export class WhitelistedProducts extends Model {
    declare whitelistId: number;
    declare serverIp: string;
    declare claimId: number;
}

WhitelistedProducts.init({
    whitelistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    serverIp: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "unrecorded"
    },
    claimId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: true,

    paranoid: true,
    tableName: "product_whitelists"
});

WhitelistedProducts.hasMany(PurchaseClaim, {
    foreignKey: 'claimId',
    sourceKey: 'claimId',
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});