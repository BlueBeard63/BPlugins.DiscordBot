import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";

export class Purchase extends Model {
    declare purchaseId: number;
    declare referenceId: string;
    declare productKey: string;
    declare productName: string;
}

Purchase.init({
    purchaseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    referenceId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unknown'
    },
    productKey: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        defaultValue: ''
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unrecorded'
    }
}, {
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: false,

    paranoid: true
});