import { EmbedBuilder, Interaction, ModalSubmitInteraction } from "discord.js";
import { DiscordInteraction } from "../../classes/interactions/discordInteraction";
import { Purchase } from "../../classes/purchases/purchase.class";
import { Product } from "../../classes/purchases/purchase.product.class";
import { randomUUID } from 'crypto';
import { PurchaseClaim } from "../../classes/purchases/purchase.claim.class";

export const data = new DiscordInteraction()
    .setName("claim-purchase");


export async function execute(modal: ModalSubmitInteraction, interaction: Interaction) {
    const transactionId = modal.fields.getTextInputValue("purchase_reference_id") as string;

    if(await Purchase.count({
        where: {
            transcationId: transactionId
        }
    }) === 0){
        modal.reply({
            content: `Failed to find any payment with paypal transaction id: ${transactionId}`,
            flags: 'Ephemeral'
        });

        return;
    }

    if(await Purchase.count({
        where: {
            transcationId: transactionId,
            purchaseClaimed: false
        }
    }) === 0){
        modal.reply({
            content: `Failed to find any unclaimed purchase with id: ${transactionId}`,
            flags: 'Ephemeral'
        });

        return;
    }

    const purchases = await Purchase.findAll({
        where: {
            transcationId: transactionId,
            purchaseClaimed: false
        }
    });

    for (const purchase of purchases) {
        const usageKey = randomUUID();

        await PurchaseClaim.create({
            claimUser: interaction.user.id,
            purchaseId: purchase.purchaseId,
            usageKey: usageKey
        });

        const embed = new EmbedBuilder()
            .setTitle("Purchase Claim")
            .setDescription("Purchases from Kofi store, for BPlugins");

        embed.setFields(
            {
                name: 'Product Name',
                value: (await Product.findOne({
                    where: {
                        productDigitalId: purchase.productDigitalId
                    }
                }))?.productName!,
                inline: true
            },
            {
                name: 'Product Usage Key',
                value: usageKey.toString(),
                inline: true
            }
        );

        await interaction.user.send({
            embeds: [embed]
        });
    }
 
    await Purchase.update({
        purchaseClaimed: true
    }, {
        where: {
            transcationId: transactionId,
            purchaseClaimed: false
        }
    });

    modal.reply({
        content: `You have now redeemed all purchases accossiated with transaction id: ${transactionId}`,
        flags: 'Ephemeral'
    })
}