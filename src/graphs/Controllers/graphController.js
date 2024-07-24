import { WorkshopSummary } from "../../workshop/models/WorkshopSummary.js";
import { WorkshopRequest } from "../../workshop/models/WorkshopRequest.js";
import { Workshop } from "../../workshop/models/Workshop.js";
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
      },
      { accepted_count: 0, rejected_count: 0, pending_count: 0 }
    );

    // const workshops = await WorkshopRequest.find();
    // const { accepted_count, rejected_count, pending_count } = workshops.reduce(
    //   (acc, workshop) => {
    //     if (workshop.status === "approved") {
    //       acc.accepted_count++;
    //     } else if (workshop.status === "rejected") {
    //       acc.rejected_count++;
    //     } else {
    //       acc.pending_count++;
    //     }
    //     return acc;
    //   },
    //   { accepted_count: 0, rejected_count: 0, pending_count: 0 }
    // );

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
    // aggregatePipeline = [{}];
    const years = [2021, 2022, 2023, 2024, 2025];

    const pieChartData = {};
    await Promise.all(
      years.map(async (year) => {
        const workshops = await WorkshopRequest.find({
          start_date: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31),
          },
        });
        const { accepted_count, rejected_count, pending_count } =
          workshops.reduce(
            (acc, workshop) => {
              if (workshop.status === "approved") {
                acc.accepted_count++;
              } else if (workshop.status === "rejected") {
                acc.rejected_count++;
              } else {
                acc.pending_count++;
              }
              return acc;
            },
            { accepted_count: 0, rejected_count: 0, pending_count: 0 }
          );
        pieChartData[year] = [
          { name: "Workshops accepted", value: accepted_count },
          { name: "Workshops rejected", value: rejected_count },
          { name: "pending", value: pending_count },
        ];
      })
    );

    return res.status(200).json(pieChartData);
  } catch (error) {
    console.log("error getting pie chart data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve pie chart data", error });
  }
}

async function getWorkshopTypesData(req, res, next) {
  try {
    // total workshoptypesData
    const workshopTypesData = [];
    const workshops = await WorkshopRequest.find();
  } catch (error) {
    console.log("error getting workshop types data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve workshop types data", error });
  }
}

export default {
  getWorkshopSummaryGraph: getWorkshopSummaryGraph,
  getTrainerGraph: getTrainerGraph,
  getTodayGraph: getTodayGraph,
  getTotalPieChartGraph: getTotalPieChartGraph,
  getYearsPieChartGraph: getYearsPieChartGraph,
};
