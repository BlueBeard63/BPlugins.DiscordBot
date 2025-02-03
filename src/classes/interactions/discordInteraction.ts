export class DiscordInteraction {
    public name!: string;

    public setName(name: string) : DiscordInteraction{
        this.name = name;
        return this;
    }
}