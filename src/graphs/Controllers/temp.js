import { WorkshopSummary } from "../../workshop/models/WorkshopSummary.js";
import { WorkshopRequest } from "../../workshop/models/WorkshopRequest.js";
import { Workshop } from "../../workshop/models/Workshop.js";
import { Trainer } from "../../auth/models/Trainer.js";
import { get } from "http";

async function getHCtotalPieData(req, res, next) {
  try {
    const data = [
      // this one is a sum of all workshops that have the status "accepted", "rejected", "pending"
      { name: "Workshops Accepted", value: 271 },
      { name: "Workshops Rejected", value: 125 },
      { name: "Pending", value: 13 },
    ];
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

async function getHCyearsPieData(req, res, next) {
  try {
    const data = {
      // these are the sum of all accepted and rejected workshops for 2022
      // might need a new field for workshops? like year?
      2022: [
        { name: "Workshops Accepted", value: 90 },
        { name: "Workshops Rejected", value: 41 },
        { name: "Pending", value: 0 },
      ],
      2023: [
        { name: "Workshops Accepted", value: 79 },
        { name: "Workshops Rejected", value: 35 },
        { name: "Pending", value: 0 },
      ],
      2024: [
        { name: "Workshops Accepted", value: 102 },
        { name: "Workshops Rejected", value: 49 },
        { name: "Pending", value: 13 },
      ],
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

async function getHCWorkshopTypesData(req, res, next) {
  try {
    const data = [
      // {name: "Workshops Completed", dealSize: 10000},
      // Idea is to first filter all workshops by types, then add all dealsize together
      { name: "Business Value Discovery", dealSize: 9520 },
      { name: "AI Platform", dealSize: 6570 },
      { name: "Infrastructure and Demo", dealSize: 18590 },
    ];
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

async function getHCClientTypesData(req, res, next) {
  try {
    const data = [
      // same for client type
      { name: "Executive", dealSize: 12570 },
      { name: "Technical", dealSize: 19850 },
    ];
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

async function getHCWorkshopTrendData(req, res, next) {
  try {
    const data = [
      {
        // not sure if this is doable for backend, need discuss
        // what are the fields right now
        month: "Jan",
        workshopRequests2022: 10,
        dealSize2022: 2000,
        workshopRequests2023: 15,
        dealSize2023: 4000,
        workshopRequests2024: 20,
        dealSize2024: 5000,
      },
      {
        month: "Feb",
        workshopRequests2022: 30,
        dealSize2022: 7000,
        workshopRequests2023: 50,
        dealSize2023: 12000,
        workshopRequests2024: 60,
        dealSize2024: 14000,
      },
      {
        month: "Mar",
        workshopRequests2022: 50,
        dealSize2022: 10000,
        workshopRequests2023: 70,
        dealSize2023: 18000,
        workshopRequests2024: 80,
        dealSize2024: 20000,
      },
      {
        month: "Apr",
        workshopRequests2022: 20,
        dealSize2022: 5000,
        workshopRequests2023: 30,
        dealSize2023: 8000,
        workshopRequests2024: 40,
        dealSize2024: 10000,
      },
      {
        month: "May",
        workshopRequests2022: 60,
        dealSize2022: 15000,
        workshopRequests2023: 80,
        dealSize2023: 20000,
        workshopRequests2024: 90,
        dealSize2024: 22000,
      },
      {
        month: "Jun",
        workshopRequests2022: 40,
        dealSize2022: 10000,
        workshopRequests2023: 60,
        dealSize2023: 15000,
        workshopRequests2024: 70,
        dealSize2024: 17000,
      },
      {
        month: "Jul",
        workshopRequests2022: 80,
        dealSize2022: 18000,
        workshopRequests2023: 90,
        dealSize2023: 22000,
        workshopRequests2024: 100,
        dealSize2024: 25000,
      },
      {
        month: "Aug",
        workshopRequests2022: 30,
        dealSize2022: 7000,
        workshopRequests2023: 40,
        dealSize2023: 10000,
        workshopRequests2024: 50,
        dealSize2024: 13000,
      },
      {
        month: "Sep",
        workshopRequests2022: 90,
        dealSize2022: 20000,
        workshopRequests2023: 100,
        dealSize2023: 25000,
        workshopRequests2024: 110,
        dealSize2024: 28000,
      },
      {
        month: "Oct",
        workshopRequests2022: 50,
        dealSize2022: 12000,
        workshopRequests2023: 65,
        dealSize2023: 15000,
        workshopRequests2024: 75,
        dealSize2024: 18000,
      },
      {
        month: "Nov",
        workshopRequests2022: 60,
        dealSize2022: 15000,
        workshopRequests2023: 80,
        dealSize2023: 20000,
        workshopRequests2024: 90,
        dealSize2024: 22000,
      },
      {
        month: "Dec",
        workshopRequests2022: 20,
        dealSize2022: 5000,
        workshopRequests2023: 25,
        dealSize2023: 6000,
        workshopRequests2024: 30,
        dealSize2024: 8000,
      },
    ];
    return res.status(200).json(data);
  } catch (erorr) {
    console.log(error);
    return res.status(500).json({ message: "unable to get data" });
  }
}

export default {
  getHCtotalPieData: getHCtotalPieData,
  getHCyearsPieData: getHCyearsPieData,
  getHCWorkshopTypesData: getHCWorkshopTypesData,
  getHCClientTypesData: getHCClientTypesData,
  getHCWorkshopTrendData: getHCWorkshopTrendData,
};
