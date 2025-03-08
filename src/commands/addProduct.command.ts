import {
    CommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder} from "discord.js";
import { Product } from "../classes/purchases/purchase.product.class";

export const data = new SlashCommandBuilder()
    .setName("add_product")
    .setDescription("Adds the product to avilable products listings")
    .addStringOption(option => option
        .setName("product_name")
        .setDescription("The name of the product")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("product_digital_id")
        .setDescription("The KoFi id for the product")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("product_url")
        .setDescription("The KoFi url for the product")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator);

export async function execute(interaction: CommandInteraction) {
    const productName = interaction.options.get("product_name")!.value as string;
    const productDigitalId = interaction.options.get("product_digital_id")!.value as string;
    const productUrl = interaction.options.get("product_url")!.value as string;

    await Product.create({
        productDigitalId: productDigitalId,
        productName: productName,
        productUrl: productUrl
    });

    await interaction.reply({
        content: `Inserted new product with name: ${productName}`,
        flags: "Ephemeral"
    });
}