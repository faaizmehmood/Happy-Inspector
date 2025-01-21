import inspectionModel from "../models/inspectionModel.js";
import { Types } from 'mongoose';
export const getPdfCounts = async (type, userId) => {

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Move to the next month
    endOfMonth.setDate(0); // Set to the last day of the current month
    endOfMonth.setHours(23, 59, 59, 999); // Set the time to the last moment of the day

    userId = new Types.ObjectId(userId);

    if (type == "monthly") 
    {

        let monthlyPdfCount = await inspectionModel.aggregate([
            {
                $match: {
                user: userId,
                },
            },
            {
                $project: {
                pdfReports: {
                    $filter: {
                    input: "$pdfReportUrl",
                    as: "report",
                    cond: {
                        $and: [
                        { $gte: ["$$report.dateGenerated", startOfMonth] }, // after the start of the month
                        { $lt: ["$$report.dateGenerated", endOfMonth] },   // before the end of the month
                        ],
                    },
                    },
                },
                },
            },
            {
                $project: {
                pdfCount: { $size: "$pdfReports" }, // count the number of reports
                },
            },
            {
                $group: {
                _id: null,
                totalPdfExports: { $sum: "$pdfCount" },
                },
            },
            
        ])

        return monthlyPdfCount.length > 0 ? monthlyPdfCount[0].totalPdfExports : 0;
    }
    else
    {
        let totalPdfCount = await inspectionModel.aggregate([
            {
                $match: {
                user: userId,
                },
            },
            {
                $project: {
                pdfReports: {
                    $filter: {
                    input: "$pdfReportUrl",
                    as: "report",
                    cond: {},
                    },
                },
                },
            },
            {
                $project: {
                pdfCount: { $size: "$pdfReports" }, // count the number of reports
                },
            },
            {
                $group: {
                _id: null,
                totalPdfExports: { $sum: "$pdfCount" },
                },
            },
            
        ])

        return totalPdfCount.length > 0 ? totalPdfCount[0].totalPdfExports : 0;
    }

};