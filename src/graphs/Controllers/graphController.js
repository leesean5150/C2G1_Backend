import { WorkshopSummary } from "../../workshop/models/WorkshopSummary.js";
import { WorkshopRequest } from "../../workshop/models/WorkshopRequest.js";
import { Client } from "../../auth/models/Client.js";
import { WorkshopData } from "../../workshop/models/WorkshopData.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { get } from "http";

async function getWorkshopSummaryGraph(req, res, next) {
  try {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const years = [2021, 2022, 2023, 2024, 2025];
    const monthData = { data: [] };

    await Promise.all(
      months.map(async (month) => {
        const entry = {
          month: month,
          actual_attendance_2024_Per_month: 0,
          expected_attendance_2024_Per_month: 0,
          projection: 0,
        };

        years.forEach((year) => {
          entry[year] = 0;
        });

        const workshopSummary = await WorkshopSummary.find({
          month: month,
        }).populate("workshops");

        for (const workshop of workshopSummary) {
          const year = workshop.year;

          if (years.includes(year)) {
            // since each workshopSummary object contains an array field called workshop, i want to count this and put into entry[year]
            entry[year] += workshop.workshops.length;

            console.log(`workshop.workshops: ${workshop.workshops}`);
          }
          if (year === 2024) {
            entry.actual_attendance_2024_Per_month +=
              workshop.actual_attendance;
            entry.expected_attendance_2024_Per_month +=
              workshop.expected_attendance;
          }
        }

        monthData.data.push(entry);
      })
    );

    monthData.data.sort((a, b) => a.index - b.index);

    monthData.data.forEach((entry) => delete entry.index);

    res.status(200).json(monthData);
  } catch (error) {
    console.log("error getting this month data: ${month}:", err);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop summary data", error });
  }
}

async function getTrainerGraph(req, res, next) {
  try {
    const trainerData = { data: [] };
    const trainers = await Trainer.find();
    trainers.forEach((trainer) => {
      const entry = {
        blank: "",
        trainer_ID: trainer.trainer_ID,
        name: trainer.fullname,
        gender: trainer.gender,
        experience: trainer.experience,
        trainer_role: trainer.trainer_role,
        availability: trainer.availability,
        workshops_completed_this_month: trainer.workshops_completed_this_month,
        ongoing_workshops: trainer.ongoing_workshops,
        workshops_completed_total: trainer.workshops_completed_total,
      };
      trainerData.data.push(entry);
    });

    res.status(200).json(trainerData);
  } catch (error) {
    console.log("error getting trainer data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve trainer data", error });
  }
}

async function getTodayGraph(req, res, next) {
  try {
    const todayData = { data: [] };
    const today = new Date();

    const workshops = await WorkshopRequest.find({
      start_date: { $lte: today },
      end_date: { $gte: today },
      status: "approved",
    });

    console.log(`Workshops: ${workshops}`);

    let trainertoday = 0;
    let parttoday = 0;
    let partexpected = 0;

    workshops.forEach((workshop) => {
      trainertoday += workshop.trainers.length;
      parttoday += workshop.pax;
      partexpected += workshop.pax;
    });
    let attendance = 0;

    if (partexpected - parttoday > 0) {
      attendance = ((partexpected - parttoday) / partexpected) * 100;
    } else {
      attendance = 100;
    }

    const entry = {
      ongoingworkshopstoday: workshops.length,
      trainertoday: trainertoday,
      participantstoday: parttoday,
      "participant-expected": partexpected,
      attendance: `${attendance.toFixed(2)}%`,
    };

    todayData.data.push(entry);

    res.status(200).json(todayData);
  } catch (error) {
    console.log("error getting today data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve today data", error });
  }
}

async function getTotalPieChartGraph(req, res, next) {
  try {
    const aggregatePipeline = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const workshops = await WorkshopRequest.aggregate(aggregatePipeline);

    const statCounter = workshops.reduce(
      (acc, workshop) => {
        if (workshop._id === "approved") {
          acc.accepted_count = workshop.count;
        } else if (workshop._id === "rejected") {
          acc.rejected_count = workshop.count;
        } else {
          acc.pending_count = workshop.count;
        }
        return acc;
      },
      { accepted_count: 0, rejected_count: 0, pending_count: 0 }
    );

    const pieChartData = [
      { name: "Workshops accepted", value: statCounter.accepted_count },
      { name: "Workshops rejected", value: statCounter.rejected_count },
      { name: "pending", value: statCounter.pending_count },
    ];
    return res.status(200).json(pieChartData);
  } catch (error) {
    console.log("error getting pie chart data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve pie chart data", error });
  }
}

async function getYearsPieChartGraph(req, res, next) {
  try {
    const years = [2022, 2023, 2024, 2025];
    const aggregatePipeline = [
      {
        $match: {
          start_date: {
            $gte: new Date(2022, 0, 1),
            $lte: new Date(2025, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$start_date" }, status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          statuses: { $push: { status: "$_id.status", count: "$count" } },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    const result = await WorkshopRequest.aggregate(aggregatePipeline);

    const pieChartData = {};

    years.forEach((year) => {
      pieChartData[year] = [
        { name: "Workshops accepted", value: 0 },
        { name: "Workshops rejected", value: 0 },
        { name: "pending", value: 0 },
      ];
    });

    result.forEach((yearData) => {
      const year = yearData._id;
      const data = yearData.statuses.reduce(
        (acc, { status, count }) => {
          if (status === "approved") {
            acc.accepted_count = count;
          } else if (status === "rejected") {
            acc.rejected_count = count;
          } else {
            acc.pending_count = count;
          }
          return acc;
        },
        { accepted_count: 0, rejected_count: 0, pending_count: 0 }
      );

      pieChartData[year] = [
        { name: "Workshops accepted", value: data.accepted_count },
        { name: "Workshops rejected", value: data.rejected_count },
        { name: "pending", value: data.pending_count },
      ];
    });

    return res.status(200).json(pieChartData);
  } catch (error) {
    console.log("error getting pie chart data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve pie chart data", error });
  }
}

async function getWorkshopTypesGraph(req, res, next) {
  try {
    const aggregatePipeline = [
      {
        $group: {
          _id: "$workshop_data",
          dealsize: { $sum: "$deal_potential" },
        },
      },
    ];

    const workshops = await WorkshopRequest.aggregate(aggregatePipeline);

    const workshopTypePromises = workshops.map(async (workshoptype) => {
      const name = await WorkshopData.findById(workshoptype._id);
      return {
        name: name.workshop_type,
        dealSize: workshoptype.dealsize,
      };
    });

    const resolvedPromises = await Promise.all(workshopTypePromises);
    return res.status(200).json(resolvedPromises);
  } catch (error) {
    console.log("error getting workshop types data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop types data", error });
  }
}

async function getClientTypeGraph(req, res, next) {
  try {
    const aggregatePipeline = [
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "clientData",
        },
      },
      { $unwind: "$clientData" },
      {
        $group: {
          _id: "$clientData.client_type",
          dealSize: { $sum: "$deal_potential" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          dealSize: 1,
        },
      },
    ];

    const clientTypes = await WorkshopRequest.aggregate(aggregatePipeline);
    console.log(`clientTypes: ${JSON.stringify(clientTypes)}`);
    return res.status(200).json(clientTypes);
  } catch (error) {
    console.log("error getting client types data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve client types data", error });
  }
}

async function getWorkshopTrendDataGraph(req, res, next) {
  try {
    const aggregatePipeline = [
      {
        $addFields: {
          month: { $month: "$start_date" },
          year: { $year: "$start_date" },
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          count: { $sum: 1 },
          dealsize: { $sum: "$deal_potential" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          monthsData: {
            $push: {
              year: "$_id.year",
              count: "$count",
              dealsize: "$dealsize",
            },
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          monthsData: 1,
        },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              { $subtract: ["$month", 1] },
            ],
          },
        },
      },
    ];

    const workshopData = await WorkshopRequest.aggregate(aggregatePipeline);

    const formattedData = workshopData.map((monthData) => {
      const result = { month: monthData.monthName };

      monthData.monthsData.forEach((data) => {
        result[`workshopRequests${data.year}`] = data.count;
        result[`dealSize${data.year}`] = data.dealsize;
      });
      return result;
    });

    return res.status(200).json(formattedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

// async function getTrainerUtilGraph(req, res, next) {
//   try {
//     const aggregatePipeline = [
//       {
//         $lookup: {
//           from: "workshoprequests",
//           localField: "workshop_request",
//           foreignField: "_id",
//           as: "workshopsData",
//         },
//       },
//       {
//         $unwind: "$workshopsData",
//       },
//       {
//         $unwind: "$workshopsData.utilisation",
//       },
//       {
//         $group: {
//           _id: "$_id",
//           totalUtilisationHours: { $sum: "$workshopsData.utilisation.hours" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           trainerID: "$_id",
//           totalUtilisationHours: 1,
//         },
//       },
//     ];
//     const result = await Trainer.aggregate(aggregatePipeline);
//     console.log(`result: ${JSON.stringify(result)}`);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "unable to get data" });
//   }
// }

async function getTrainerUtilGraph(req, res, next) {
  try {
    const aggregatePipeline = [
      {
        $lookup: {
          from: "trainers",
          localField: "trainers",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      {
        $unwind: "$trainerData",
      },
      {
        $unwind: "$utilisation",
      },
      {
        $group: {
          _id: "$trainerData._id",
          total_trainer_utilization: { $sum: "$utilisation.hours" },
          name: { $first: "$trainerData.fullname" },
          workshops_completed_total: {
            $first: "$trainerData.workshops_completed_total",
          },
          ongoing_workshops: { $first: "$trainerData.ongoing_workshops" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          total_trainer_utilization: 1,
          workshops_completed_total: 1,
          ongoing_workshops: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ];

    const result = await WorkshopRequest.aggregate(aggregatePipeline);

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

export default {
  getWorkshopSummaryGraph: getWorkshopSummaryGraph,
  getTrainerGraph: getTrainerGraph,
  getTodayGraph: getTodayGraph,
  getTotalPieChartGraph: getTotalPieChartGraph,
  getYearsPieChartGraph: getYearsPieChartGraph,
  getWorkshopTypesGraph: getWorkshopTypesGraph,
  getClientTypeGraph: getClientTypeGraph,
  getWorkshopTrendDataGraph: getWorkshopTrendDataGraph,
  getTrainerUtilGraph: getTrainerUtilGraph,
};
