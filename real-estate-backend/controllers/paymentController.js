import Stripe from "stripe";
import userModel from "../models/userModel.js";
import pricingModel from "../models/pricingModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import transactionModel from "../models/transactionModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try
    {
        const { pricingTierId, subscriptionType } = req.body;
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const checkAlreadySubscribed = await subscriptionModel.findOne({ user: _id, pricingTier: pricingTierId, isActive: true, isTrial: false });
        if (checkAlreadySubscribed) {
            return res.status(400).json({ message: 'Already subscribed to this tier' });
        }

        const validSubscriptionTypes = ["monthly", "yearly"];
        if (!validSubscriptionTypes.includes(subscriptionType.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid subscription type' });
        }

        const pricingTier = await pricingModel.findById(pricingTierId);
        if(!pricingTier)
        {
            return res.status(400).json({ message: 'Invalid pricing tier' });
        }

        // Retrieve or create a Stripe Customer
        let customer = await stripe.customers.search({
            query: `email:'${user.email}'`,
        });

        if (customer.data.length === 0) {
            customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user._id.toString() }, // Attach internal user ID
            });
        } else {
            customer = customer.data[0];
        }

        // Create the Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: customer.id,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: pricingTier.title,
                            description: pricingTier.description,
                        },
                        unit_amount: subscriptionType === "monthly"
                            ? pricingTier.monthlyPrice * 100
                            : pricingTier.yearlyPrice * 100,
                        recurring: {
                            interval: subscriptionType.toLowerCase(),
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: user._id,
                pricingTierId: pricingTierId,
                pricingTierName: pricingTier.name,
                subscriptionType,
            },
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Error creating checkout session:', err.stack || err);
        return res.status(400).json({ message: 'Failed to create checkout session', error: err.message });
    }
};

export const cancelSubscription = async (req, res) => {
    try
    {
        const { _id, role } = req.user;

        const user = await userModel.findById(_id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const subscription = await subscriptionModel.findOne({ user: _id, isActive: true });
        if (!subscription) {
            return res.status(400).json({ message: 'No active subscription found' });
        }

        const stripeResponse = await stripe.subscriptions.del(subscription.externalId, { at_period_end: true });

        subscription.isActive = false;
        subscription.endDate = new Date();
        await subscription.save();

        return res.status(200).json({ message: 'Subscription canceled successfully' });

    }
    catch(err)
    {
        console.log(err);
        return res.status(400).json({ message: 'Failed to cancel subscription', error: err.message });
    }
};