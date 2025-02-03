import {DataTypes, Model} from "sequelize";
import {sequelizeConnection} from "../../database/database";
import {Commission} from "./commission.class";

export class CommissionOwner extends Model {
    declare ownerId: string;
    declare ownerDiscordId: string;
    declare commissionId: string;
}

CommissionOwner.init({
    ownerId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    ownerDiscordId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    commissionId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "commission_owner",
    createdAt: true,
    updatedAt: false,

    paranoid: true,
});

Commission.hasMany(CommissionOwner, {
    sourceKey: "commissionId",
    foreignKey: "commissionId",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});