import Product from "../models/Product.js";

async function workshop(req, res, next) {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: 200,
      data: [
            {
                "month": "Jan",
                "2024": "15",
                "Actual_Attendance_2024_Per_Month": "1950",
                "Expected_Attendance_2024_Per_Month": "2070",
                "2023": "25",
                "2022": "20",
                "2021": "18",
                "projection": "35"
            },
            {
                "month": "Feb",
                "2024": "27",
                "Actual_Attendance_2024_Per_Month": "1820",
                "Expected_Attendance_2024_Per_Month": "2190",
                "2023": "30",
                "2022": "22",
                "2021": "25",
                "projection": "40"
            },
            {
                "month": "Mar",
                "2024": "50",
                "Actual_Attendance_2024_Per_Month": "2470",
                "Expected_Attendance_2024_Per_Month": "2760",
                "2023": "55",
                "2022": "45",
                "2021": "50",
                "projection": "70"
            },
            {
                "month": "Apr",
                "2024": "32",
                "Actual_Attendance_2024_Per_Month": "1630",
                "Expected_Attendance_2024_Per_Month": "1920",
                "2023": "40",
                "2022": "38",
                "2021": "35",
                "projection": "55"
            },
            {
                "month": "May",
                "2024": "68",
                "Actual_Attendance_2024_Per_Month": "2640",
                "Expected_Attendance_2024_Per_Month": "2860",
                "2023": "55",
                "2022": "60",
                "2021": "62",
                "projection": "75"
            },
            {
                "month": "Jun",
                "2024": "83",
                "Actual_Attendance_2024_Per_Month": "2950",
                "Expected_Attendance_2024_Per_Month": "3070",
                "2023": "85",
                "2022": "80",
                "2021": "78",
                "projection": "90"
            },
            {
                "month": "Jul",
                "2024": "45",
                "Actual_Attendance_2024_Per_Month": "2150",
                "Expected_Attendance_2024_Per_Month": "2480",
                "2023": "35",
                "2022": "40",
                "2021": "42",
                "projection": "60"
            },
            {
                "month": "Aug",
                "2024": "60",
                "Actual_Attendance_2024_Per_Month": "2380",
                "Expected_Attendance_2024_Per_Month": "2650",
                "2023": "50",
                "2022": "55",
                "2021": "52",
                "projection": "70"
            },
            {
                "month": "Sep",
                "2024": "38",
                "Actual_Attendance_2024_Per_Month": "1730",
                "Expected_Attendance_2024_Per_Month": "1980",
                "2023": "20",
                "2022": "25",
                "2021": "28",
                "projection": "55"
            },
            {
                "month": "Oct",
                "2024": "75",
                "Actual_Attendance_2024_Per_Month": "2820",
                "Expected_Attendance_2024_Per_Month": "2990",
                "2023": "80",
                "2022": "78",
                "2021": "70",
                "projection": "85"
            },
            {
                "month": "Nov",
                "2024": "90",
                "Actual_Attendance_2024_Per_Month": "2930",
                "Expected_Attendance_2024_Per_Month": "3140",
                "2023": "72",
                "2022": "65",
                "2021": "60",
                "projection": "95"
            },
            {
                "month": "Dec",
                "2024": "23",
                "Actual_Attendance_2024_Per_Month": "1540",
                "Expected_Attendance_2024_Per_Month": "1760",
                "2023": "30",
                "2022": "35",
                "2021": "32",
                "projection": "50"
            }
        ]
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function trainer(req, res, next) {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: 200,
      data: [
        {
            "blank": "",
            "trainer_ID": "T01",
            "name": "Jack",
            "gender": "male",
            "experience": "5",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 3,
            "ongoing_workshops": 3,
            "workshops_completed_total": 50
        },
        {
            "blank": "",
            "trainer_ID": "T02",
            "name": "Emily",
            "gender": "female",
            "experience": "8",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 2,
            "workshops_completed_total": 49
        },
        {
            "blank": "",
            "trainer_ID": "T04",
            "name": "Sophia",
            "gender": "female",
            "experience": "3",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 0,
            "ongoing_workshops": 5,
            "workshops_completed_total": 72
        },
        {
            "blank": "",
            "trainer_ID": "T05",
            "name": "Michael",
            "gender": "male",
            "experience": "6",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 2,
            "workshops_completed_total": 36
        },
        {
            "blank": "",
            "trainer_ID": "T06",
            "name": "Olivia",
            "gender": "female",
            "experience": "10",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 4,
            "ongoing_workshops": 2,
            "workshops_completed_total": 79
        },
        {
            "blank": "",
            "trainer_ID": "T07",
            "name": "Daniel",
            "gender": "male",
            "experience": "4",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 4,
            "workshops_completed_total": 4
        },
        {
            "blank": "",
            "trainer_ID": "T09",
            "name": "Ethan",
            "gender": "male",
            "experience": "7",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 2,
            "workshops_completed_total": 56
        },
        {
            "blank": "",
            "trainer_ID": "T10",
            "name": "Isabella",
            "gender": "female",
            "experience": "9",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 3,
            "ongoing_workshops": 3,
            "workshops_completed_total": 65
        },
        {
            "blank": "",
            "trainer_ID": "T11",
            "name": "James",
            "gender": "male",
            "experience": "2",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 1,
            "workshops_completed_total": 12
        },
        {
            "blank": "",
            "trainer_ID": "T12",
            "name": "Charlotte",
            "gender": "female",
            "experience": "6",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 0,
            "ongoing_workshops": 4,
            "workshops_completed_total": 47
        },
        {
            "blank": "",
            "trainer_ID": "T13",
            "name": "Henry",
            "gender": "male",
            "experience": "3",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 2,
            "workshops_completed_total": 23
        },
        {
            "blank": "",
            "trainer_ID": "T14",
            "name": "Mia",
            "gender": "female",
            "experience": "5",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 3,
            "ongoing_workshops": 1,
            "workshops_completed_total": 30
        },
        {
            "blank": "",
            "trainer_ID": "T15",
            "name": "Alexander",
            "gender": "male",
            "experience": "4",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 3,
            "workshops_completed_total": 21
        },
        {
            "blank": "",
            "trainer_ID": "T16",
            "name": "Amelia",
            "gender": "female",
            "experience": "7",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 2,
            "workshops_completed_total": 53
        },
        {
            "blank": "",
            "trainer_ID": "T17",
            "name": "Benjamin",
            "gender": "male",
            "experience": "8",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 4,
            "ongoing_workshops": 2,
            "workshops_completed_total": 70
        },
        {
            "blank": "",
            "trainer_ID": "T18",
            "name": "Grace",
            "gender": "female",
            "experience": "1",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 0,
            "ongoing_workshops": 1,
            "workshops_completed_total": 5
        },
        {
            "blank": "",
            "trainer_ID": "T19",
            "name": "Samuel",
            "gender": "male",
            "experience": "9",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 3,
            "ongoing_workshops": 3,
            "workshops_completed_total": 68
        },
        {
            "blank": "",
            "trainer_ID": "T20",
            "name": "Lily",
            "gender": "female",
            "experience": "6",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 3,
            "workshops_completed_total": 42
        },
        {
            "blank": "",
            "trainer_ID": "T21",
            "name": "Ryan",
            "gender": "male",
            "experience": "5",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 2,
            "workshops_completed_total": 33
        },
        {
            "blank": "",
            "trainer_ID": "T22",
            "name": "Chloe",
            "gender": "female",
            "experience": "4",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 3,
            "ongoing_workshops": 4,
            "workshops_completed_total": 28
        },
        {
            "blank": "",
            "trainer_ID": "T23",
            "name": "Mason",
            "gender": "male",
            "experience": "7",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 4,
            "ongoing_workshops": 1,
            "workshops_completed_total": 55
        },
        {
            "blank": "",
            "trainer_ID": "T24",
            "name": "Zoe",
            "gender": "female",
            "experience": "8",
            "trainer_role": "Training Assistant",
            "availability": "Available",
            "workshops_completed_this_month": 1,
            "ongoing_workshops": 3,
            "workshops_completed_total": 61
        },
        {
            "blank": "",
            "trainer_ID": "T25",
            "name": "Logan",
            "gender": "male",
            "experience": "6",
            "trainer_role": "Training Lead",
            "availability": "Available",
            "workshops_completed_this_month": 2,
            "ongoing_workshops": 2,
            "workshops_completed_total": 47
        }
    ]
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function today(req, res, next) {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: 200,
      data: [
        {
            "ongoingworkshopstoday": "5",
            "trainertoday": "7",
            "participantstoday": "127",
            "participants-expected": "150",
            "attendance": "85%"
        }
    ]
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

async function save(req, res, next) {
  try {
    const product = new Product();
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    await product.save();

    return res.status(201).json({
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}

export default {
  workshop: workshop,
  trainer: trainer,
  today: today,
  save: save,
};
