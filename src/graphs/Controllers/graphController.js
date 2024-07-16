import { WorkshopSummary } from "../../workshop/models/WorkshopSummary.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { get } from "http";

async function getGraphWorkshopSummary(req, res, next) {
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
    const todayString = today.toDateString();

    const workshops = await Workshop.find({
      date: todayString,
    });

    const ongoingWorkshops = workshops.filter(
      (workshop) => workshop.status === "ongoing"
    );

    todayData.data.push({
      ongoingworkshopstoday: ongoingWorkshops.length,
      trainertoday: 0,
      participantstoday: 0,
      "participant-expected": 0,
      attedance: "0%",
    });

    res.status(200).json(todayData);
  } catch (error) {
    console.log("error getting today data:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve today data", error });
  }
}

export default {
  getGraphWorkshopSummary: getGraphWorkshopSummary,
  getTrainerGraph: getTrainerGraph,
};
