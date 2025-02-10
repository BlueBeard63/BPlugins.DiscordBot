import {Client, PrivateThreadChannel, TextThreadChannel} from "discord.js";

export class CommissionWatcher {
    constructor(client: Client) {
         setTimeout(async () => await this.GatherAndBump(client), 1000 * 60 * 50);
    }

    private async GatherAndBump(client: Client) : Promise<void> {
        const privateThreads = client.guilds.cache.first()?.channels?.cache
            .filter(x => x.isThread())
            .filter(x => x as TextThreadChannel)
            .map(x => x as PrivateThreadChannel)
            .filter(x => x !== undefined);

        await this.BumpThreads(privateThreads);
    }

    private async BumpThreads(threads: PrivateThreadChannel[] | undefined) : Promise<void> {
        if(threads === undefined){
            console.log("[ERROR] Threads provided are undefined!")
            return;
        }

        for (const thread of threads) {
            if (thread.autoArchiveDuration === 10080) {
                await thread.setAutoArchiveDuration(4320).catch(() => {
                    console.log(`[ERROR] Could not bump thread: ${thread.name}`);
                    return;
                });
                console.log(`[INFO] Thread Bumped: ${thread.name}`);
            } else {
                await thread.setAutoArchiveDuration(10080).catch(() => {
                    console.log(`[ERROR] Could not bump thread: ${thread.name}`);
                    return;
                });
                console.log(`[INFO] Thread Bumped: ${thread.name}`);
            }
        }
    }
}