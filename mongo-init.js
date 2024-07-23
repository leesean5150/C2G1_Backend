db = db.getSiblingDB("docker");

db.clients.insertMany([
  {
    username: "client",
    email: "client@email.com",
    fullname: "Client",
    password: "$2a$10$0I9kCnsc8PKycuImPcEfHO3P5CbSLUjOZVyKFbEoyvq9YnH9SlyRq",
    country: "Singapore",
    role: "client",
    workshop: [],
  },
  {
    username: "johndoefromjohnbrosinc",
    email: "johndoefromjohnbrosinc@email.com",
    fullname: "johndoefromjohnbrosinc",
    password: "$2a$10$tb.sifvCVRC3yJdRt0TGgeCwT42R9T7AMOuXIvllEXcmr1ZJ../Qi",
    country: "Singapore",
    role: "client",
    workshop: [],
  },
]);

db.trainers.insertMany([
  {
    username: "trainer",
    email: "trainer@email.com",
    fullname: "trainer",
    password: "$2a$10$.dhERvM2156v1O9.6iqwZOY9lUyROAQE0JtyHaO7cjuj3.hrunGNe",
    role: "trainer",
    availability: "Active",
    trainer_role: "Trainer Lead",
    workshops_completed_this_month: 0,
    ongoing_workshops: 0,
    workshops_completed_total: 0,
    workshop_request: [],
    unavailableTimeslots: [],
  },
  {
    username: "Trainer_3_JohnDoe",
    email: "Trainer_3_JohnDoe@email.com",
    fullname: "Trainer_3_JohnDoe",
    password: "$2a$10$ch9V9/itSbDYVALT9Xl21eIMMfFBdMHNClSIYREZ1FmvtnO9Fhrg.",
    role: "trainer",
    availability: "Active",
    trainer_role: "Trainer Lead",
    workshops_completed_this_month: 0,
    ongoing_workshops: 0,
    workshops_completed_total: 0,
    workshop_request: [],
    unavailableTimeslots: [],
  },
]);

db.workshopdatas.insertMany([
  {
    workshop_name: "Intro to Python",
    workshop_ID: "01",
    workshop_type: "Business Value Discovery",
    workshop_details: "Nothing to do with the snake.",
    availability: "Available",
    workshop_requests: [],
  },
  {
    workshop_name: "Intro to Java 21",
    workshop_ID: "02",
    workshop_type: "Business Value Discovery",
    workshop_details: "No its not about Indonesia.",
    availability: "Available",
    workshop_requests: [],
  },
  {
    workshop_name: "Intro to AI",
    workshop_ID: "03",
    workshop_type: "AI Platform",
    workshop_details: "hello world!",
    availability: "Available",
    workshop_requests: [],
  },
  {
    workshop_name: "Intro to C Hashtag",
    workshop_ID: "04",
    workshop_type: "Infrastructure and Demo",
    workshop_details:
      "Those saying its C sharp don't know what they're talking about...",
    availability: "Available",
    workshop_requests: [],
  },
]);
