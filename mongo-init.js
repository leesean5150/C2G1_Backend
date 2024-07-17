db = db.getSiblingDB("docker");

db.clients.insertMany([
  {
    username: "client12345",
    email: "client123@client.com",
    fullname: "Client",
    password: "$2a$10$RL7CzLXMEaIqbkV9SwkRQeK5zLMKyggBboxayQnHbSBuCHksGoOjS",
    country: "Singapore",
    role: "client",
    workshop: [],
  },
]);

// db.workshopsummaries.insertMany([
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
