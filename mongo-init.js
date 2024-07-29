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
  {
    company_role: "Manager",
    company: "Company A",
    name: "John Doe",
    email: "john.doe@companya.com",
    phone_number: 1234567890,
    pax: 20,
    deal_potential: 5000,
    country: "USA",
    venue: "Venue A",
    start_date: new Date("2024-07-01"),
    end_date: new Date("2024-07-02"),
    request_message: "Looking forward to this workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Director",
    company: "Company B",
    name: "Jane Smith",
    email: "jane.smith@companyb.com",
    phone_number: 2345678901,
    pax: 30,
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue B",
    start_date: new Date("2024-07-05"),
    end_date: new Date("2024-07-06"),
    request_message: "Please provide details",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Team Lead",
    company: "Company C",
    name: "Alice Johnson",
    email: "alice.johnson@companyc.com",
    phone_number: 3456789012,
    pax: 15,
    deal_potential: 7000,
    country: "Singapore",
    venue: "Venue C",
    start_date: new Date("2024-07-27"),
    end_date: new Date("2024-07-30"),
    request_message: "Excited about this workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CTO",
    company: "Company D",
    name: "Bob Brown",
    email: "bob.brown@companyd.com",
    phone_number: 4567890123,
    pax: 25,
    deal_potential: 12000,
    country: "Australia",
    venue: "Venue D",
    start_date: new Date("2023-08-15"),
    end_date: new Date("2023-08-16"),
    request_message: "Looking for detailed insights",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CEO",
    company: "Company E",
    name: "Charlie Davis",
    email: "charlie.davis@companye.com",
    phone_number: 5678901234,
    pax: 10,
    deal_potential: 3000,
    country: "Malaysia",
    venue: "Venue E",
    start_date: new Date("2023-08-20"),
    end_date: new Date("2023-08-21"),
    request_message: "Need advanced strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Project Manager",
    company: "Company F",
    name: "David Evans",
    email: "david.evans@companyf.com",
    phone_number: 6789012345,
    pax: 18,
    deal_potential: 8000,
    country: "Malaysia",
    venue: "Venue F",
    start_date: new Date("2023-02-25"),
    end_date: new Date("2023-02-26"),
    request_message: "Excited for this opportunity",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [trainer2._id, trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "HR Manager",
    company: "Company G",
    name: "Eva Green",
    email: "eva.green@companyg.com",
    phone_number: 7890123456,
    pax: 22,
    deal_potential: 6000,
    country: "Singapore",
    venue: "Venue G",
    start_date: new Date("2023-03-30"),
    end_date: new Date("2023-03-31"),
    request_message: "Looking for HR solutions",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer2._id],
    client: clientClient._id,
  },
  {
    company_role: "Marketing Head",
    company: "Company H",
    name: "George Hill",
    email: "george.hill@companyh.com",
    phone_number: 8901234567,
    pax: 28,
    deal_potential: 9000,
    country: "USA",
    venue: "Venue H",
    start_date: new Date("2023-09-05"),
    end_date: new Date("2023-09-06"),
    request_message: "Need marketing strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Sales Manager",
    company: "Company I",
    name: "Helen Irwin",
    email: "helen.irwin@companyi.com",
    phone_number: 9012345678,
    pax: 12,
    deal_potential: 4000,
    country: "Singapore",
    venue: "Venue I",
    start_date: new Date("2023-09-10"),
    end_date: new Date("2023-09-11"),
    request_message: "Focus on sales techniques",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Sales Manager",
    company: "Company J",
    name: "jelly jean",
    email: "jelly.jean@companyj.com",
    phone_number: 8046745642,
    pax: 432,
    deal_potential: 54000,
    country: "Singapore",
    venue: "Venue J",
    start_date: new Date("2024-07-28"),
    end_date: new Date("2024-07-29"),
    request_message: "jelly bean productions",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Sales Manager",
    company: "Company K",
    name: "kellen hellar",
    email: "kellen.hellar@companyK.com",
    phone_number: 6231235678,
    pax: 52,
    deal_potential: 90000,
    country: "Singapore",
    venue: "Venue J",
    start_date: new Date("2024-07-17"),
    end_date: new Date("2024-07-20"),
    request_message: "king fisher",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },

  // 2024 : 5
  // 2023 : 6
  // insert more data here

  {
    company_role: "Sales Manager",
    company: "Company K",
    name: "kellen hellar",
    email: "kellen.hellar@companyK.com",
    phone_number: 6231235678,
    pax: 52,
    deal_potential: 25000,
    country: "Singapore",
    venue: "Venue J",
    start_date: new Date("2024-07-17"),
    end_date: new Date("2024-07-20"),
    request_message: "king fisher",
    status: "rejected",
    reject_reason: "Insufficient budget",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Marketing Director",
    company: "Company A",
    name: "Alice Smith",
    email: "alice.smith@companyA.com",
    phone_number: 6234567890,
    pax: 40,
    deal_potential: 15000,
    country: "USA",
    venue: "Venue A",
    start_date: new Date("2023-05-10"),
    end_date: new Date("2023-05-12"),
    request_message: "Annual Sales Training",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "HR Manager",
    company: "Company B",
    name: "Bob Johnson",
    email: "bob.johnson@companyB.com",
    phone_number: 6235678901,
    pax: 35,
    deal_potential: 20000,
    country: "Canada",
    venue: "Venue B",
    start_date: new Date("2023-08-15"),
    end_date: new Date("2023-08-18"),
    request_message: "Employee Onboarding",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "IT Manager",
    company: "Company C",
    name: "Charlie Davis",
    email: "charlie.davis@companyC.com",
    phone_number: 6236789012,
    pax: 50,
    deal_potential: 30000,
    country: "UK",
    venue: "Venue C",
    start_date: new Date("2024-01-20"),
    end_date: new Date("2024-01-23"),
    request_message: "Cybersecurity Training",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Project Manager",
    company: "Company D",
    name: "Diana Prince",
    email: "diana.prince@companyD.com",
    phone_number: 6237890123,
    pax: 45,
    deal_potential: 10000,
    country: "Australia",
    venue: "Venue D",
    start_date: new Date("2023-12-01"),
    end_date: new Date("2023-12-03"),
    request_message: "Project Management Workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Finance Manager",
    company: "Company E",
    name: "Edward Norton",
    email: "edward.norton@companyE.com",
    phone_number: 6238901234,
    pax: 30,
    deal_potential: 25000,
    country: "Germany",
    venue: "Venue E",
    start_date: new Date("2023-11-10"),
    end_date: new Date("2023-11-12"),
    request_message: "Financial Analysis Training",
    status: "rejected",
    reject_reason: "Budget constraints",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Operations Manager",
    company: "Company F",
    name: "Fiona Apple",
    email: "fiona.apple@companyF.com",
    phone_number: 6249012345,
    pax: 60,
    deal_potential: 30000,
    country: "France",
    venue: "Venue F",
    start_date: new Date("2024-04-05"),
    end_date: new Date("2024-04-07"),
    request_message: "Operations Efficiency Workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Sales Representative",
    company: "Company G",
    name: "George Michael",
    email: "george.michael@companyG.com",
    phone_number: 6250123456,
    pax: 25,
    deal_potential: 5000,
    country: "Italy",
    venue: "Venue G",
    start_date: new Date("2023-06-20"),
    end_date: new Date("2023-06-22"),
    request_message: "Sales Strategy Session",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Customer Service Manager",
    company: "Company H",
    name: "Hannah Montana",
    email: "hannah.montana@companyH.com",
    phone_number: 6261234567,
    pax: 55,
    deal_potential: 20000,
    country: "Spain",
    venue: "Venue H",
    start_date: new Date("2023-09-14"),
    end_date: new Date("2023-09-16"),
    request_message: "Customer Service Excellence",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Logistics Coordinator",
    company: "Company I",
    name: "Ian McKellen",
    email: "ian.mckellen@companyI.com",
    phone_number: 6272345678,
    pax: 20,
    deal_potential: 10000,
    country: "Japan",
    venue: "Venue I",
    start_date: new Date("2024-02-11"),
    end_date: new Date("2024-02-13"),
    request_message: "Logistics Optimization",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Operations Coordinator",
    company: "Company J",
    name: "Jane Doe",
    email: "jane.doe@companyJ.com",
    phone_number: 6273456789,
    pax: 45,
    deal_potential: 15000,
    country: "Netherlands",
    venue: "Venue J",
    start_date: new Date("2024-05-05"),
    end_date: new Date("2024-05-07"),
    request_message: "Operational Efficiency Training",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Product Manager",
    company: "Company K",
    name: "Karl Urban",
    email: "karl.urban@companyK.com",
    phone_number: 6274567890,
    pax: 38,
    deal_potential: 20000,
    country: "New Zealand",
    venue: "Venue K",
    start_date: new Date("2024-03-15"),
    end_date: new Date("2024-03-18"),
    request_message: "Product Management Workshop",
    status: "rejected",
    reject_reason: "Schedule conflict",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Team Lead",
    company: "Company L",
    name: "Laura Palmer",
    email: "laura.palmer@companyL.com",
    phone_number: 6275678901,
    pax: 60,
    deal_potential: 30000,
    country: "Sweden",
    venue: "Venue L",
    start_date: new Date("2024-06-01"),
    end_date: new Date("2024-06-03"),
    request_message: "Team Leadership Workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "HR Coordinator",
    company: "Company M",
    name: "Mike Ross",
    email: "mike.ross@companyM.com",
    phone_number: 6276789012,
    pax: 50,
    deal_potential: 10000,
    country: "Denmark",
    venue: "Venue M",
    start_date: new Date("2024-05-20"),
    end_date: new Date("2024-05-23"),
    request_message: "Human Resources Training",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Manager",
    company: "Company A",
    name: "John Doe",
    email: "john.doe@companya.com",
    phone_number: 1234567890,
    pax: 20,
    deal_potential: 5000,
    country: "USA",
    venue: "Venue A",
    start_date: new Date("2024-09-01"),
    end_date: new Date("2024-10-02"),
    request_message: "Looking forward to this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Director",
    company: "Company B",
    name: "Jane Smith",
    email: "jane.smith@companyb.com",
    phone_number: 2345678901,
    pax: 30,
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue B",
    start_date: new Date("2024-08-05"),
    end_date: new Date("2024-09-06"),
    request_message: "Please provide details",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Team Lead",
    company: "Company C",
    name: "Alice Johnson",
    email: "alice.johnson@companyc.com",
    phone_number: 3456789012,
    pax: 15,
    deal_potential: 7000,
    country: "Singapore",
    venue: "Venue C",
    start_date: new Date("2024-11-27"),
    end_date: new Date("2024-12-30"),
    request_message: "Excited about this workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CTO",
    company: "Company D",
    name: "Bob Brown",
    email: "bob.brown@companyd.com",
    phone_number: 4567890123,
    pax: 25,
    deal_potential: 12000,
    country: "Australia",
    venue: "Venue D",
    start_date: new Date("2023-10-15"),
    end_date: new Date("2023-11-16"),
    request_message: "Looking for detailed insights",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CEO",
    company: "Company E",
    name: "Charlie Davis",
    email: "charlie.davis@companye.com",
    phone_number: 5678901234,
    pax: 10,
    deal_potential: 3000,
    country: "Malaysia",
    venue: "Venue E",
    start_date: new Date("2023-09-20"),
    end_date: new Date("2023-10-21"),
    request_message: "Need advanced strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Project Manager",
    company: "Company F",
    name: "David Evans",
    email: "david.evans@companyf.com",
    phone_number: 6789012345,
    pax: 18,
    deal_potential: 8000,
    country: "Malaysia",
    venue: "Venue F",
    start_date: new Date("2023-02-25"),
    end_date: new Date("2023-02-26"),
    request_message: "Excited for this opportunity",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [trainer2._id, trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "HR Manager",
    company: "Company G",
    name: "Eva Green",
    email: "eva.green@companyg.com",
    phone_number: 7890123456,
    pax: 22,
    deal_potential: 6000,
    country: "Singapore",
    venue: "Venue G",
    start_date: new Date("2023-03-30"),
    end_date: new Date("2023-03-31"),
    request_message: "Looking for HR solutions",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer2._id],
    client: clientClient._id,
  },
  {
    company_role: "Marketing Head",
    company: "Company H",
    name: "George Hill",
    email: "george.hill@companyh.com",
    phone_number: 8901234567,
    pax: 28,
    deal_potential: 9000,
    country: "USA",
    venue: "Venue H",
    start_date: new Date("2023-07-05"),
    end_date: new Date("2023-08-06"),
    request_message: "Need marketing strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Sales Manager",
    company: "Company I",
    name: "Helen Irwin",
    email: "helen.irwin@companyi.com",
    phone_number: 9012345678,
    pax: 12,
    deal_potential: 4000,
    country: "Singapore",
    venue: "Venue I",
    start_date: new Date("2023-07-10"),
    end_date: new Date("2023-08-11"),
    request_message: "Focus on sales techniques",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Manager",
    company: "Company A",
    name: "John Doe",
    email: "john.doe@companya.com",
    phone_number: 1234567890,
    pax: 20,
    deal_potential: 5000,
    country: "USA",
    venue: "Venue A",
    start_date: new Date("2024-11-01"),
    end_date: new Date("2024-12-02"),
    request_message: "Looking forward to this workshop",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Director",
    company: "Company B",
    name: "Jane Smith",
    email: "jane.smith@companyb.com",
    phone_number: 2345678901,
    pax: 30,
    deal_potential: 10000,
    country: "Singapore",
    venue: "Venue B",
    start_date: new Date("2024-05-05"),
    end_date: new Date("2024-05-06"),
    request_message: "Please provide details",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Team Lead",
    company: "Company C",
    name: "Alice Johnson",
    email: "alice.johnson@companyc.com",
    phone_number: 3456789012,
    pax: 15,
    deal_potential: 7000,
    country: "Singapore",
    venue: "Venue C",
    start_date: new Date("2024-03-27"),
    end_date: new Date("2024-03-30"),
    request_message: "Excited about this workshop",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CTO",
    company: "Company D",
    name: "Bob Brown",
    email: "bob.brown@companyd.com",
    phone_number: 4567890123,
    pax: 25,
    deal_potential: 12000,
    country: "Australia",
    venue: "Venue D",
    start_date: new Date("2023-08-15"),
    end_date: new Date("2023-08-16"),
    request_message: "Looking for detailed insights",
    status: "rejected",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "CEO",
    company: "Company E",
    name: "Charlie Davis",
    email: "charlie.davis@companye.com",
    phone_number: 5678901234,
    pax: 10,
    deal_potential: 3000,
    country: "Malaysia",
    venue: "Venue E",
    start_date: new Date("2023-04-20"),
    end_date: new Date("2023-04-21"),
    request_message: "Need advanced strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "Project Manager",
    company: "Company F",
    name: "David Evans",
    email: "david.evans@companyf.com",
    phone_number: 6789012345,
    pax: 18,
    deal_potential: 8000,
    country: "Malaysia",
    venue: "Venue F",
    start_date: new Date("2023-05-25"),
    end_date: new Date("2023-05-26"),
    request_message: "Excited for this opportunity",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [trainer2._id, trainer1._id],
    client: clientJohnDoe._id,
  },
  {
    company_role: "HR Manager",
    company: "Company G",
    name: "Eva Green",
    email: "eva.green@companyg.com",
    phone_number: 7890123456,
    pax: 22,
    deal_potential: 6000,
    country: "Singapore",
    venue: "Venue G",
    start_date: new Date("2023-03-30"),
    end_date: new Date("2023-03-31"),
    request_message: "Looking for HR solutions",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer2._id],
    client: clientClient._id,
  },
  {
    company_role: "Marketing Head",
    company: "Company H",
    name: "George Hill",
    email: "george.hill@companyh.com",
    phone_number: 8901234567,
    pax: 28,
    deal_potential: 9000,
    country: "USA",
    venue: "Venue H",
    start_date: new Date("2023-08-05"),
    end_date: new Date("2023-09-06"),
    request_message: "Need marketing strategies",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Sales Manager",
    company: "Company I",
    name: "Helen Irwin",
    email: "helen.irwin@companyi.com",
    phone_number: 9012345678,
    pax: 12,
    deal_potential: 4000,
    country: "Singapore",
    venue: "Venue I",
    start_date: new Date("2023-09-10"),
    end_date: new Date("2023-09-11"),
    request_message: "Focus on sales techniques",
    status: "approved",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [trainer1._id],
    client: clientClient._id,
  },
  {
    company_role: "Manager",
    company: "Company M",
    name: "Mary Jane",
    email: "mary.jane@companym.com",
    phone_number: 1234567890,
    pax: 25,
    deal_potential: 7000,
    country: "USA",
    venue: "Venue M",
    start_date: new Date("2024-08-10"),
    end_date: new Date("2024-08-12"),
    request_message: "Eager for the upcoming workshop",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Director",
    company: "Company N",
    name: "Nancy Drew",
    email: "nancy.drew@companyn.com",
    phone_number: 2345678901,
    pax: 35,
    deal_potential: 15000,
    country: "Canada",
    venue: "Venue N",
    start_date: new Date("2024-09-15"),
    end_date: new Date("2024-09-17"),
    request_message: "Looking forward to the session",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "Team Lead",
    company: "Company O",
    name: "Oscar Wilde",
    email: "oscar.wilde@companyo.com",
    phone_number: 3456789012,
    pax: 40,
    deal_potential: 20000,
    country: "UK",
    venue: "Venue O",
    start_date: new Date("2024-10-20"),
    end_date: new Date("2024-10-22"),
    request_message: "Excited about the training",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData3._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "CTO",
    company: "Company P",
    name: "Peter Parker",
    email: "peter.parker@companyp.com",
    phone_number: 4567890123,
    pax: 50,
    deal_potential: 25000,
    country: "Australia",
    venue: "Venue P",
    start_date: new Date("2024-11-05"),
    end_date: new Date("2024-11-07"),
    request_message: "Looking forward to detailed insights",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData1._id,
    trainers: [],
    client: clientClient._id,
  },
  {
    company_role: "CEO",
    company: "Company Q",
    name: "Quincy Adams",
    email: "quincy.adams@companyq.com",
    phone_number: 5678901234,
    pax: 30,
    deal_potential: 18000,
    country: "Singapore",
    venue: "Venue Q",
    start_date: new Date("2024-12-12"),
    end_date: new Date("2024-12-14"),
    request_message: "Looking for strategic insights",
    status: "submitted",
    reject_reason: "",
    utilisation: [
      { hours: 1, utilisation_details: "Detail 1" },
      { hours: 2, utilisation_details: "Detail 2" },
      { hours: 3, utilisation_details: "Detail 3" },
      { hours: 4, utilisation_details: "Detail 4" },
    ],
    workshop_data: workshopData2._id,
    trainers: [],
    client: clientClient._id,
  },
]);
