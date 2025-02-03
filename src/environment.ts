import dotenv from 'dotenv'

dotenv.config();

export const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID;
export const DISCORD_BOT_SECRET = process.env.DISCORD_BOT_SECRET;

export const DATABASE_HOST = process.env.DATABASE_HOST;
export const DATABASE_PORT = process.env.DATABASE_PORT;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
export const DATABASE_NAME = process.env.DATABASE_NAME;