db = db.getSiblingDB("docker");

db.clients.insertMany([
  {
    username: "client",
    email: "client@email.com",
    fullname: "Client",
    client_type: "Technical",
    password: "$2a$10$0I9kCnsc8PKycuImPcEfHO3P5CbSLUjOZVyKFbEoyvq9YnH9SlyRq",
    country: "Singapore",
    role: "client",
    workshop: [],
  },
  {
    username: "johndoefromjohnbrosinc",
    email: "johndoefromjohnbrosinc@email.com",
    fullname: "johndoefromjohnbrosinc",
    client_type: "Executive",
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

console.log("here123");

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

//// generating variables for workshop requests
const clientJohnDoe = db.clients.findOne({
  username: "johndoefromjohnbrosinc",
});
const clientClient = db.clients.findOne({ username: "client" });

const workshopData1 = db.workshopdatas.findOne({
  workshop_name: "Intro to Python",
});
const workshopData2 = db.workshopdatas.findOne({
  workshop_name: "Intro to Java 21",
});
const workshopData3 = db.workshopdatas.findOne({
  workshop_name: "Intro to AI",
});

console.log("client:", clientJohnDoe);
console.log("workshopData1:", workshopData1);
console.log("workshopData2:", workshopData2);
console.log("workshopData3:", workshopData3);

const trainer1 = db.trainers.findOne({
  username: "trainer",
});
const trainer2 = db.trainers.findOne({
  username: "Trainer_3_JohnDoe",
});

console.log("trainer1:", trainer1._id);
console.log("trainer2:", trainer2._id);

//// inserting workshop requests
db.workshoprequests.insertMany([
  // Workshop Request 1
  {
    company_role: "Manager",
    company: "Company A",
    name: "A",
    email: "A@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue A",
    start_date: new Date("2024-07-01"),
    end_date: new Date("2024-07-08"),
    request_message: "Looking forward to this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 2

  {
    company_role: "President",
    company: "Company B",
    name: "B",
    email: "B@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue B",
    start_date: new Date("2024-07-09"),
    end_date: new Date("2024-07-16"),
    request_message: "Excited about this opportunity",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 3

  {
    company_role: "General Manager",
    company: "Company C",
    name: "C",
    email: "C@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue C",
    start_date: new Date("2024-07-17"),
    end_date: new Date("2024-07-24"),
    request_message: "We are looking forward to this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 4

  {
    company_role: "Manager",
    company: "Company D",
    name: "D",
    email: "D@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 5000,
    country: "Malaysia",
    venue: "Venue D",
    start_date: new Date("2024-07-25"),
    end_date: new Date("2024-08-01"),
    request_message: "Can't wait for the workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 5

  {
    company_role: "President",
    company: "Company E",
    name: "E",
    email: "E@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "USA",
    venue: "Venue E",
    start_date: new Date("2024-08-02"),
    end_date: new Date("2024-08-09"),
    request_message: "This will be a great event",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 6

  {
    company_role: "General Manager",
    company: "Company F",
    name: "F",
    email: "F@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "Singapore",
    venue: "Venue F",
    start_date: new Date("2024-08-10"),
    end_date: new Date("2024-08-17"),
    request_message: "Anticipating a great workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 7

  {
    company_role: "Manager",
    company: "Company G",
    name: "G",
    email: "G@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 10000,
    country: "Malaysia",
    venue: "Venue G",
    start_date: new Date("2024-08-18"),
    end_date: new Date("2024-08-25"),
    request_message: "Excited for this workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 8

  {
    company_role: "President",
    company: "Company H",
    name: "H",
    email: "H@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue H",
    start_date: new Date("2024-08-26"),
    end_date: new Date("2024-09-02"),
    request_message: "Looking forward to this event",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 9

  {
    company_role: "General Manager",
    company: "Company I",
    name: "I",
    email: "I@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue I",
    start_date: new Date("2024-09-03"),
    end_date: new Date("2024-09-10"),
    request_message: "This workshop is much awaited",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 10

  {
    company_role: "Manager",
    company: "Company J",
    name: "J",
    email: "J@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "Malaysia",
    venue: "Venue J",
    start_date: new Date("2024-09-11"),
    end_date: new Date("2024-09-18"),
    request_message: "We are excited about this workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },

  /////////////////////////////////////////////////////////////////
  // 2023 DATA
  /////////////////////////////////////////////////////////////////
  // Workshop Request 11
  {
    company_role: "General Manager",
    company: "Company K",
    name: "K",
    email: "K@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue K",
    start_date: new Date("2023-03-01"),
    end_date: new Date("2023-03-08"),
    request_message: "Excited to start the new year with this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 12
  {
    company_role: "Manager",
    company: "Company L",
    name: "L",
    email: "L@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 5000,
    country: "Malaysia",
    venue: "Venue L",
    start_date: new Date("2023-06-09"),
    end_date: new Date("2023-06-16"),
    request_message: "Looking forward to the event",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 13
  {
    company_role: "President",
    company: "Company M",
    name: "M",
    email: "M@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "USA",
    venue: "Venue M",
    start_date: new Date("2023-02-17"),
    end_date: new Date("2023-02-24"),
    request_message: "Great opportunity to learn",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 14
  {
    company_role: "General Manager",
    company: "Company N",
    name: "N",
    email: "N@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "Singapore",
    venue: "Venue N",
    start_date: new Date("2023-05-25"),
    end_date: new Date("2023-06-01"),
    request_message: "Eager for this workshop",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 15
  {
    company_role: "Manager",
    company: "Company O",
    name: "O",
    email: "O@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Malaysia",
    venue: "Venue O",
    start_date: new Date("2023-04-02"),
    end_date: new Date("2023-04-09"),
    request_message: "This workshop will be beneficial",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 16
  {
    company_role: "President",
    company: "Company P",
    name: "P",
    email: "P@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue P",
    start_date: new Date("2023-08-10"),
    end_date: new Date("2023-08-17"),
    request_message: "Looking forward to the insights",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 17
  {
    company_role: "General Manager",
    company: "Company Q",
    name: "Q",
    email: "Q@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue Q",
    start_date: new Date("2023-10-18"),
    end_date: new Date("2023-10-25"),
    request_message: "This will be an excellent workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 18
  {
    company_role: "Manager",
    company: "Company R",
    name: "R",
    email: "R@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "Malaysia",
    venue: "Venue R",
    start_date: new Date("2023-07-26"),
    end_date: new Date("2023-08-02"),
    request_message: "We're preparing for this event",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 19
  {
    company_role: "President",
    company: "Company S",
    name: "S",
    email: "S@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "USA",
    venue: "Venue S",
    start_date: new Date("2023-09-06"),
    end_date: new Date("2023-09-13"),
    request_message: "We are excited for this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 20
  {
    company_role: "General Manager",
    company: "Company T",
    name: "T",
    email: "T@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 5000,
    country: "Singapore",
    venue: "Venue T",
    start_date: new Date("2023-12-14"),
    end_date: new Date("2023-12-21"),
    request_message: "This workshop is highly anticipated",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Manager",
    company: "Company U",
    name: "U",
    email: "U@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Malaysia",
    venue: "Venue U",
    start_date: new Date("2023-01-03"),
    end_date: new Date("2023-01-10"),
    request_message: "Looking forward to the insights",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 22
  {
    company_role: "President",
    company: "Company V",
    name: "V",
    email: "V@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue V",
    start_date: new Date("2023-04-15"),
    end_date: new Date("2023-04-22"),
    request_message: "This workshop will be highly beneficial",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 23
  {
    company_role: "General Manager",
    company: "Company W",
    name: "W",
    email: "W@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 5000,
    country: "Singapore",
    venue: "Venue W",
    start_date: new Date("2023-07-01"),
    end_date: new Date("2023-07-08"),
    request_message: "Excited for this workshop opportunity",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 24
  {
    company_role: "Manager",
    company: "Company X",
    name: "X",
    email: "X@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Malaysia",
    venue: "Venue X",
    start_date: new Date("2023-08-10"),
    end_date: new Date("2023-08-17"),
    request_message: "Looking forward to this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 25
  {
    company_role: "President",
    company: "Company Y",
    name: "Y",
    email: "Y@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue Y",
    start_date: new Date("2023-09-15"),
    end_date: new Date("2023-09-22"),
    request_message: "Eager to attend this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 26
  {
    company_role: "General Manager",
    company: "Company Z",
    name: "Z",
    email: "Z@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue Z",
    start_date: new Date("2023-11-01"),
    end_date: new Date("2023-11-08"),
    request_message: "Highly anticipated workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 27
  {
    company_role: "Manager",
    company: "Company AA",
    name: "AA",
    email: "AA@gmail.com",
    phone_number: 1234567890,
    pax: "10-20",
    deal_potential: 5000,
    country: "Malaysia",
    venue: "Venue AA",
    start_date: new Date("2023-03-05"),
    end_date: new Date("2023-03-12"),
    request_message: "Great learning opportunity",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 28
  {
    company_role: "President",
    company: "Company BB",
    name: "BB",
    email: "BB@gmail.com",
    phone_number: 1234567890,
    pax: "<10",
    deal_potential: 5000,
    country: "USA",
    venue: "Venue BB",
    start_date: new Date("2023-05-14"),
    end_date: new Date("2023-05-21"),
    request_message: "Looking forward to this event",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  // Workshop Request 29
  {
    company_role: "General Manager",
    company: "Company CC",
    name: "CC",
    email: "CC@gmail.com",
    phone_number: 1234567890,
    pax: ">50",
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue CC",
    start_date: new Date("2023-06-17"),
    end_date: new Date("2023-06-24"),
    request_message: "This workshop is going to be fantastic",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  // Workshop Request 30
  {
    company_role: "Manager",
    company: "Company DD",
    name: "DD",
    email: "DD@gmail.com",
    phone_number: 1234567890,
    pax: "21-50",
    deal_potential: 10000,
    country: "Malaysia",
    venue: "Venue DD",
    start_date: new Date("2023-02-07"),
    end_date: new Date("2023-02-14"),
    request_message: "Anticipating great insights from this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 0, utilisation_details: "Detail 1" },
      { hours: 0, utilisation_details: "Detail 2" },
      { hours: 0, utilisation_details: "Detail 3" },
      { hours: 0, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
]);
