import { Sequelize } from 'sequelize'
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    DATABASE_PORT,
    DATABASE_USERNAME,
} from "../environment";

const dbName = DATABASE_NAME as string
const dbUser = DATABASE_USERNAME as string
const dbHost = DATABASE_HOST as string
const dbPassword = DATABASE_PASSWORD as string

export const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: Number.parseInt(DATABASE_PORT!),
    dialect: "mysql"
});