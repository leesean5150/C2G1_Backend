db = db.getSiblingDB("docker");

db.trainers.insertMany([
  {
    username: "trainer1",
    email: "trainer1@email.com",
    fullname: "Trainer1",
    password: "$2a$10$GKEGvr4Ja1ctOi5X3J.mYuDfq6IGEYlydsxzy3bdJOwaHopXfz2fK",
    role: "trainer",
    availability: "Active",
    trainer_role: "Trainer Lead",
    workshops_completed_this_month: 0,
    ongoing_workshops: 0,
    workshops_completed_total: 0,
    workshops: [],
    unavailableTimeslots: [],
  },
  {
    username: "trainer2",
    email: "trainer2@email.com",
    fullname: "Trainer1",
    password: "$2a$10$GKEGvr4Ja1ctOi5X3J.mYuDfq6IGEYlydsxzy3bdJOwaHopXfz2fK",
    role: "trainer",
    availability: "Active",
    trainer_role: "Trainer Lead",
    workshops_completed_this_month: 0,
    ongoing_workshops: 0,
    workshops_completed_total: 0,
    workshops: [],
    unavailableTimeslots: [],
  },
]);

// db.workshops.insertMany([
//   {
//     trainer_data: [
//       {
//         workshop_name: "Intro to Python",
//         workshop_ID: "01",
//         workshop_type: "Business Value Discovery",
//         workshop_details: "Nothing to do with the snake.",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to Java 21",
//         workshop_ID: "02",
//         workshop_type: "Business Value Discovery",
//         workshop_details: "No its not about Indonesia.",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to AI",
//         workshop_ID: "03",
//         workshop_type: "AI Platform",
//         workshop_details: "hello world!",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to C Hashtag",
//         workshop_ID: "04",
//         workshop_type: "Infrastructure and Demo",
//         workshop_details:
//           "Those saying its C sharp don't know what they're talking about...",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to Python",
//         workshop_ID: "01",
//         workshop_type: "Business Value Discovery",
//         workshop_details: "Nothing to do with the snake.",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to Java 21",
//         workshop_ID: "02",
//         workshop_type: "Business Value Discovery",
//         workshop_details: "No its not about Indonesia.",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to AI",
//         workshop_ID: "03",
//         workshop_type: "AI Platform",
//         workshop_details: "hello world!",
//         workshop_availability: "Available",
//       },
//       {
//         workshop_name: "Intro to C Hashtag",
//         workshop_ID: "04",
//         workshop_type: "Infrastructure and Demo",
//         workshop_details:
//           "Those saying its C sharp don't know what they're talking about...",
//         workshop_availability: "Available",
//       },
//     ],
//   },
// ]);
