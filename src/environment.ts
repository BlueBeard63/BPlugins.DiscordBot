import dotenv from 'dotenv'

dotenv.config();

export const DISCORD_BOT_ID = process.env.DISCORD_BOT_ID!;
export const DISCORD_BOT_SECRET = process.env.DISCORD_BOT_SECRET!;

export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_PORT = process.env.DATABASE_PORT!;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
export const DATABASE_NAME = process.env.DATABASE_NAME!;

export const COMMISSIONS_CHANNEL_ID = process.env.COMMISSIONS_CHANNEL_ID!;
export const COMMISSIONS_DEV_ROLE_ID = process.env.COMMISSIONS_DEV_ROLE_ID!;
export const DEFAULT_ROLE_ID = process.env.DEFAULT_ROLE_ID!;