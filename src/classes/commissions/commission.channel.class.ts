import {Commission} from "./commission.class";
import {DataTypes, Model} from "sequelize";
import {sequelizeConnection} from "../../database/database";
import {CommissionOwner} from "./commission.owner.class";

export class CommissionChannel extends Model {
    declare id: string;
    declare channelId: string;
    declare commissionId: string;
}

CommissionChannel.init({
    id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    commissionId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "commission_channels",

    updatedAt: false,
    createdAt: false,
});

Commission.hasOne(CommissionChannel, {
    sourceKey: "commissionId",
    foreignKey: "commissionId",
});