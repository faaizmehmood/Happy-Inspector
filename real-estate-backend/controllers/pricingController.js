import pricingModel from "../models/pricingModel.js";

export const getPricingTiers = async (req, res) => {
    try {
        const pricingTiers = await pricingModel.find({}); // Retrieve all pricing tiers
        res.status(200).json(pricingTiers);
    } catch (error) {
        console.error("Error retrieving pricing tiers:", error);
        res.status(500).json({ message: "Error retrieving pricing tiers" });
    }
};

export const getPricingPlan = async (req, res) => {
    try {
        const { planType } = req.query;

        if (planType !== "FREETIER" && planType !== "STANDARDTIER" && planType !== "TOPTIER") {
            return res.status(400).json({ message: "Invalid plan type" });
        }

        const plan = await pricingModel.findOne({ name: planType }); 
        res.status(200).json(plan);
    } catch (error) {
        console.error("Error retrieving plans:", error);
        res.status(500).json({ message: "Error retrieving plans" });
    }
};

export const updatePricingPlan = async (req, res) => {
    try
    {
        const { planType, planData } = req.body;

        if (planType !== "FREETIER" && planType !== "STANDARDTIER" && planType !== "TOPTIER") {
            return res.status(400).json({ message: "Invalid plan type" });
        }

        const plan = await pricingModel.findOne({ name: planType });
        if (!plan) {
            return res.status(400).json({ message: "Plan not found" });
        }

        if (typeof planData.inspectionLimit !== "number" || typeof planData.templateLimit !== "number" || typeof planData.propertyLimit !== "number" || typeof planData.monthlyPDFLimit !== "number" || typeof planData.roomLimit !== "number" || typeof planData.elementLimit !== "number")
        {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        if (typeof planData.monthlyPrice !== "number" || typeof planData.yearlyPrice !== "number")
        {
            return res.status(400).json({ message: "Invalid plan price data" });
        }
        

        plan.inspectionLimit = planData.inspectionLimit;
        plan.templateLimit = planData.templateLimit;
        plan.propertyLimit = planData.propertyLimit;
        plan.monthlyPDFLimit = planData.monthlyPDFLimit;
        plan.roomLimit = planData.roomLimit;
        plan.elementLimit = planData.elementLimit;

        if (plan.name !== "FREE")
        {
            plan.monthlyPrice = planData.monthlyPrice;
            plan.yearlyPrice = planData.yearlyPrice;
        }

        await plan.save();

        res.status(201).json({ message: "Plan updated successfully" });

    }
    catch (error)
    {
        console.error("Error updating plan:", error);
        res.status(500).json({ message: "Error updating plan" });
    }
};

export const changeFreeTierReportWatermark = async (req, res) => {
    try {
        const { reportWatermark } = req.body;

        if (!reportWatermark) {
            return res.status(400).json({ message: "Report watermark is required" });
        }

        if (typeof reportWatermark !== "string") {
            return res.status(400).json({ message: "Report watermark must be a string" });
        }

        if (reportWatermark.length > 50) {
            return res.status(400).json({ message: "Report watermark cannot exceed 50 characters" });
        }

        const plan = await pricingModel.findOne({ name: "FREETIER" });
        if (!plan) {
            return res.status(400).json({ message: "Plan not found" });
        }
        plan.reportWatermark = reportWatermark;
        await plan.save();
        res.status(200).json({ message: "Report watermark updated successfully" });
    } catch (error) {
        console.error("Error updating report watermark:", error);
        res.status(500).json({ message: "Error updating report watermark" });
    }
};