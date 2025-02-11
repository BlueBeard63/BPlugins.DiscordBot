import {ChannelType, Client, PrivateThreadChannel, TextChannel} from "discord.js";
import {Logger} from "../logger";
import {COMMISSIONS_CHANNEL_ID, COMMISSIONS_GUILD_ID} from "../environment";
import {CommissionChannel} from "../classes/commissions/commission.channel.class";

export class CommissionWatcher {
    constructor(client: Client) {
        this.GatherAndBump(client)
        setTimeout(async () => await this.GatherAndBump(client), 1000 * 60 * 60);
    }

    private async GatherAndBump(client: Client): Promise<void> {
        await client.guilds.cache.get(COMMISSIONS_GUILD_ID)?.channels.fetch();
        const privateThreads = (await (client.guilds.cache.get(COMMISSIONS_GUILD_ID)?.channels.cache.get(COMMISSIONS_CHANNEL_ID) as TextChannel).threads.fetch()).threads
            .filter(x => x.type == ChannelType.PrivateThread)
            .map(x => x);

        await this.BumpThreads(privateThreads);
    }

    private async BumpThreads(threads: PrivateThreadChannel[] | undefined): Promise<void> {
        if (threads === undefined) {
            Logger.LogError("Threads provided are undefined!")
            return;
        }

        for (const thread of threads) {
            if(await CommissionChannel.count({
                where: {
                    channelId: thread.id
                }
            }) === 0){
                Logger.LogWarning(`Ignoring thread (${thread.name}) due to not being in commission channel table`);
                continue;
            }

            if(thread.locked){
                Logger.LogWarning(`Ignoring thread (${thread.name}) due to not being locked and supposedly closed/rejected`);
                continue;
            }

            if (thread.autoArchiveDuration === 10080) {
                await thread.setAutoArchiveDuration(4320).catch(() => {
                    Logger.LogError(`Could not bump thread: ${thread.name}`);
                    return;
                });
                Logger.LogInfo(`Thread Bumped: ${thread.name}`);
            } else {
                await thread.setAutoArchiveDuration(10080).catch(() => {
                    Logger.LogError(`Could not bump thread: ${thread.name}`);
                    return;
                });
                Logger.LogInfo(`Thread Bumped: ${thread.name}`);
            }
        }
    }
}