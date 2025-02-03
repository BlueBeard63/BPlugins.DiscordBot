import {CacheType, CommandInteraction, Interaction, REST, Routes} from "discord.js";
import { commands } from "../commands";
import {DISCORD_BOT_SECRET} from "../environment";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({version: "10"}).setToken(DISCORD_BOT_SECRET as string);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({guildId}: DeployCommandsProps, botId: string) {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(botId, guildId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

export async function dealWithCommand(interaction: Interaction<CacheType>) {
    const i = interaction as CommandInteraction;
    const {commandName} = i;

    console.log(commandName);

    if (commands[commandName as keyof typeof commands]) {
        await commands[commandName as keyof typeof commands].execute(i);
    }
}