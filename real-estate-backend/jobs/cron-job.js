import cron from 'node-cron'
import { checkAndDowngradeTiers, startAndManageSubscriptions } from '../services/pricingAndTier.js'

const scheduleCronJobs = () => {

    // Runs every day at midnight (00:00) UTC 1 time per day
    cron.schedule('0 0 * * *', async() => {
        await startAndManageSubscriptions();
    });

    //Runs every day at 2 hours after midnight UTC 1 time per day
    cron.schedule('0 2 * * *', async() => {
        await checkAndDowngradeTiers();
    });
};

export default scheduleCronJobs;