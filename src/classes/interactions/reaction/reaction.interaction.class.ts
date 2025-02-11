import {DataTypes, Model} from "sequelize";
import {sequelizeConnection} from "../../../database/database";

export class ReactionRole extends Model {
    declare reactionRoleId: number;
    declare messageId: string;
    declare channelId: string;
    declare reactionId: string;
    declare roleId: string;
}

ReactionRole.init({
    reactionRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reactionId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "reactions",
    sequelize: sequelizeConnection,
    createdAt: true,
    updatedAt: false,
});