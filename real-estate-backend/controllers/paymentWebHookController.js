import Stripe from "stripe";

import userModel from "../models/userModel.js";
import pricingModel from "../models/pricingModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import transactionModel from "../models/transactionModel.js";

import { calculateSubscriptionEndDate } from "../services/pricingAndTier.js";

export const handleWebHooks = async (req, res) => {
    try {

        const sig = req.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;
        try {
            event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle different event types
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case "invoice.payment_succeeded":
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            // case "customer.subscription.created":
            //     await handleSubscriptionCreated(event.data.object);
            //     break;
            case "customer.subscription.deleted":
                await handleSubscriptionCanceled(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });

    } catch (err) {
        return res.status(400).send({
            message: "Failed to handle webhook!",
            error: err.message,    
        });
    }
};

export const handleCheckoutSessionCompleted = async (session) => {
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const customerEmail = session.customer_email; // Get the email from the session


    let user = await userModel.findById(session.metadata.userId);

    if (!user) {
        user = await userModel.findOne({ email: customerEmail });
    }

    if (user) {
        // Save subscription details
        let pricingTier = await pricingModel.findById(session.metadata.pricingTierId);
        if (!pricingTier) {

            pricingTier = await pricingModel.findOne({ name: session.metadata.pricingTierName });
        }

        const existingSubscription = await subscriptionModel.findOne({ user: user._id, isActive: true, isTrial: false }).populate("pricingTier");
        if (existingSubscription) 
        {
            if (existingSubscription.pricingTier.name == "TOPTIER" && pricingTier.name == "STANDARDTIER")
            {
                await subscriptionModel.create({
                    user: user._id,
                    pricingTier: pricingTier._id,
                    subscriptionType: session.metadata.subscriptionType,
                    externalId: subscriptionId,
                    startDate: existingSubscription.endDate,
                    endDate: calculateSubscriptionEndDate(existingSubscription.endDate,session.metadata.subscriptionType),
                    isActive: false,
                    isTrial: false,
                });

            }
            else if (existingSubscription.pricingTier.name == "STANDARDTIER" && pricingTier.name == "TOPTIER")
            {
                await subscriptionModel.create({
                    user: user._id,
                    pricingTier: pricingTier._id,
                    subscriptionType: session.metadata.subscriptionType,
                    externalId: subscriptionId,
                    startDate: new Date(),
                    endDate: calculateSubscriptionEndDate(new Date(), session.metadata.subscriptionType),
                    isActive: true,
                    isTrial: false,
                });

                existingSubscription.isActive = false;
                await existingSubscription.save();

                user.role = pricingTier.name;
                await user.save();
            }
        }
        else
        {
            await subscriptionModel.create({
                user: user._id,
                pricingTier: pricingTier._id,
                subscriptionType: session.metadata.subscriptionType,
                externalId: subscriptionId,
                startDate: new Date(),
                endDate: calculateSubscriptionEndDate(new Date(), session.metadata.subscriptionType),
                isActive: true,
                isTrial: false,
            });

            const existingTrial = await subscriptionModel.findOne({ user: user._id, isActive: true, isTrial: true });
            if (existingTrial) {
                existingTrial.isActive = false;
                await existingTrial.save();
            }

            user.role = pricingTier.name;
            await user.save();

        }

        // Save transaction details
        await transactionModel.create({
            user: user._id,
            pricingTier: pricingTier._id,
            transactionType: "SUBSCRIPTION",
            amount: session.amount_total / 100,
            description: `Subscription purchase for ${pricingTier.name} tier`,
        });
    }
};

export const handleInvoicePaymentSucceeded = async (invoice) => {

    // Save Renewal Details
    await transactionModel.create({
        user: invoice.customer,
        pricingTier: invoice.lines.data[0].price.product,
        transactionType: "RENEWAL",
        amount: invoice.total / 100,
        description: `Renewal for ${invoice.lines.data[0].price.product.name} tier`,
    });
};

// export const handleSubscriptionCreated = async (subscription) => {};

export const handleSubscriptionCanceled = async (subscription) => {

    // Save Cancellation Details
    await transactionModel.create({
        user: subscription.customer,
        pricingTier: subscription.items.data[0].price.product,
        transactionType: "CANCELLATION",
        amount: subscription.items.data[0].price.unit_amount / 100,
        description: `Cancellation for ${subscription.items.data[0].price.product.name} tier`,
    });
};

// export const handleSubscriptionUpdated = async (subscription) => {};