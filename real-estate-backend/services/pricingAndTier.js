import subscriptionModel from "../models/subscriptionModel.js";
import userModel from "../models/userModel.js";
export const checkAndDowngradeTiers = async () => {
    try
    {
        const gracePeriodDate = new Date();
        gracePeriodDate.setDate(gracePeriodDate.getDate() + 2); // Adds 2 days grace period

        const expiredSubscriptions = await subscriptionModel.find({ isActive: true, endDate: { $lte: gracePeriodDate } });

        for (const subscription of expiredSubscriptions) {
            subscription.isActive = false;

            // Downgrade the subscription to free tier
            const relevantUser = await userModel.findById(subscription.user);
            relevantUser.role = "FREETIER";

            await relevantUser.save();
            await subscription.save();

        }

        console.log(`Tiers of ${expiredSubscriptions.length} user(s) downgraded successfully!`);

    }
    catch(error)
    {
        console.log(error);
    }
};

export const startAndManageSubscriptions = async () => {
    try
    {
        const triggerableSubscriptions = await subscriptionModel.find({ isActive: false, startDate: { $lte: new Date() } , endDate: { $gt: new Date() } }).populate("pricingTier");

        for (const subscription of triggerableSubscriptions) {

            const relevantUser = await userModel.findById(subscription.user);
            const existingSubscription = await subscriptionModel.findOne({ user: relevantUser._id, isActive: true });

            if (existingSubscription) {
                existingSubscription.isActive = false;
                await existingSubscription.save();
            }

            relevantUser.role = subscription.pricingTier.name;
            await relevantUser.save();

            subscription.isActive = true;
            await subscription.save();

        }

        console.log(`Subscriptions of ${triggerableSubscriptions.length} user(s) started successfully!`);


    }
    catch(error)
    {
        console.log(error);
    }
};

export const calculateSubscriptionEndDate = (startDate, subscriptionType) => {
    
    if (subscriptionType === "monthly")
    {
        let newEndDate = new Date(startDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        return newEndDate;
        
    }
    else if (subscriptionType === "yearly")
    {
        let newEndDate = new Date(startDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        return newEndDate;
    }
}