import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";
import { Purchase } from "./purchase.class";

export class PurchaseClaim extends Model {
    declare claimId: number;
    declare claimUser: string;
    declare purchaseId: number;
    declare usageKey: string;
}

PurchaseClaim.init({
    claimId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    claimUser: {
        type: DataTypes.STRING,
        allowNull: false
    },
    purchaseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usageKey: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: false,
    paranoid: true,

    tableName: 'productclaim'
});

PurchaseClaim.hasOne(Purchase, {
    sourceKey: 'purchaseId',
    foreignKey: 'purchaseId',
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});