import {DataTypes, Model} from "sequelize";
import {sequelizeConnection} from "../../database/database";
import {ECommissionStatus} from "./ECommissionStatus";

export class Commission extends Model {
    declare commissionId: string;
    declare commissionNumber: number;
    declare commissionName: string;
    declare commissionDetails: string;
    declare commissionBudget: number;
    declare commissionDueDate: Date;
    declare commissionStatus: ECommissionStatus;
}

Commission.init({
    commissionId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
    },
    commissionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
    },
    commissionName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Unknown",
    },
    commissionDetails: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",  
    },
    commissionBudget: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    commissionDueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    commissionStatus: {
        type: DataTypes.ENUM(...Object.values(ECommissionStatus)),
        allowNull: false,
        defaultValue: ECommissionStatus.Pending,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "commissions",
    createdAt: true,
    updatedAt: false,

    paranoid: true,
});