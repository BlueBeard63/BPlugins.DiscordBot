import {DataTypes, Model} from "sequelize";
import {EButtonType} from "./EButtonType";
import {sequelizeConnection} from "../../../database/database";
import {ButtonExtra} from "./button.extra";

export class Buttons extends Model {
    declare buttonId: string;
    declare channelId: string;
    declare messageId: string;
    declare buttonType: EButtonType;
    declare buttonExtraData: string;
    declare extraData: ButtonExtra;

    static async doesButtonExist(buttonId: string, channelId: any, messageId: string) : Promise<boolean> {
        return await Buttons.count({
            where: {
                buttonId: buttonId,
                channelId: channelId,
                messageId: messageId
            }
        }) !== 0;
    }

    static async getButton(buttonId: string, channelId: any, messageId: string) : Promise<Buttons>{
        return (await Buttons.findOne({
            where: {
                buttonId: buttonId,
                channelId: channelId,
                messageId: messageId
            }
        }))!;
    }
}

Buttons.init({
    buttonId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
    },
    buttonType: {
        type: DataTypes.ENUM(...Object.values(EButtonType)),
        defaultValue: EButtonType.Unknown
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    buttonExtraData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: JSON.stringify(new ButtonExtra())
    },
    extraData: {
        type: DataTypes.VIRTUAL,
        get() {
            return JSON.parse(this.buttonExtraData);
        }
    }
}, {
    sequelize: sequelizeConnection,
    tableName: "buttons",
    createdAt: true,
    updatedAt: false,
});