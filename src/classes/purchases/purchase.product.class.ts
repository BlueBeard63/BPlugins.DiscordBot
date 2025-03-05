import { DataTypes, Model } from "sequelize";
import { sequelizeConnection } from "../../database/database";

export class Product extends Model {
    declare productId: number;
    declare productDigitalId: string;
    declare productName: string;
    declare productUrl: string;
}

Product.init({
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    productDigitalId: {
        type: DataTypes.STRING,
        allowNull: false,
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