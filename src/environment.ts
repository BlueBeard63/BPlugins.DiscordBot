import * as fs from "node:fs";
import * as toml from "toml";

export class Config {
    data: any;

    constructor() {
        const file = fs.readFileSync("./config.toml", "utf8").replace("\uFEFF", '');
        this.data = toml.parse(file);
    }
}

const config = new Config();

export const DISCORD_BOT_ID = config.data.DiscordBot.DISCORD_BOT_ID as string;
export const DISCORD_BOT_SECRET = config.data.DiscordBot.DISCORD_BOT_SECRET as string;

export const DATABASE_HOST = config.data.Database.DATABASE_HOST as string;
export const DATABASE_PORT = config.data.Database.DATABASE_PORT as Number;
export const DATABASE_USERNAME = config.data.Database.DATABASE_USERNAME as string;
export const DATABASE_PASSWORD = config.data.Database.DATABASE_PASSWORD as string;
export const DATABASE_NAME = config.data.Database.DATABASE_NAME as string;

export const COMMISSIONS_GUILD_ID = config.data.DiscordServer.COMMISSIONS_GUILD_ID as string;
export const COMMISSIONS_CHANNEL_ID = config.data.DiscordServer.COMMISSIONS_CHANNEL_ID as string;
export const COMMISSIONS_DEV_ROLE_ID = config.data.DiscordServer.COMMISSIONS_DEV_ROLE_ID as string;
export const DEFAULT_ROLE_IDS = (config.data.DiscordServer.DEFAULT_ROLE_IDS as string)!.split(',');

export const KofiServerPort = config.data.KofiStore.Port as number;