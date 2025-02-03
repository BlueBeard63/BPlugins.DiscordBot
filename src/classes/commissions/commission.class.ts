import {DataTypes, Model} from "sequelize";
import {sequelizeConnection} from "../../database/database";

export class Commission extends Model {
    declare commissionId: string;
    declare commissionNumber: number;
    declare commissionName: string;
    declare commissionBudget: number;
}

Commission.init({
    commissionId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
    },
    commissionNumber: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
    },
    commissionName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Unknown",
    },
    commissionBudget: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "commissions",
    createdAt: true,
    updatedAt: false,

    paranoid: true,
});