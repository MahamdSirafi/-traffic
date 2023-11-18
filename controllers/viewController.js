const violation = require("../models/violationModel");
const list = require("../models/listViolationModel");
const car = require("../models/carModel");
const catchAsync = require("./../utils/catchAsync");
//public
exports.information = catchAsync(async (req, res, next) => {
  res.locals.list = await list.find();
  res.render("information");
});
//user
exports.home = (req, res) => {
  res.render("home");
};
exports.getAccount = (req, res) => {
  res.status(200).render("MyAccount");
};
exports.MtnCash = (req, res) => {
  console.log("object");
  res.render("user/MtnCash", { sum: req.params.sum, id: req.params.id });
};
exports.SyriatelCash = (req, res) => {
  res.render("user/SyriatelCash", { sum: req.params.sum });
};
exports.userservice = (req, res) => {
  res.render("user/services");
};

// exports.violation = catchAsync(async (req, res, next) => {
//   // req.user.national_number = "2023053492";
//   const data = [];

//   const national_number = req.user.national_number;
//   const caruser = await car.find({ national_number: national_number });

//   for (const item of caruser) {
//     let sum = 0;

//     const carData = {
//       name: item.name,
//       model: item.model,
//       plate_number: item.plate_number,
//       arrViolation: [],
//       sum: Number,
//     };

//     const violationuser = await violation
//       .find({ plate_number: item.plate_number, paid: false })
//       .populate({ path: "violation" })
//       .populate({ path: "user" })
//       .lean();

//     for (const itemV of violationuser) {
//       const violationData = {
//         _id: itemV._id,
//         Location: {
//           region: itemV.Location.region,
//           start: itemV.Location.start,
//         },
//         violation: {
//           type: itemV.violation.type,
//           cost: itemV.violation.cost,
//         },
//         createdAt: itemV.createdAt,
//       };
//       sum += itemV.violation.cost;

//       carData.arrViolation.push(violationData);
//     }
//     carData.sum = sum;
//     data.push(carData);
//   }
//   res.render("user/violation", { data });
// });

//officer
exports.getform = (req, res) => {
  res.render("officer/officerviolation");
};

//emp
exports.getcreateCar = (req, res) => {
  res.render("emp/createCar");
};
exports.findcar = (req, res) => {
  res.render("emp/getcar");
};

//admin
exports.Dashboard = (req, res) => {
  res.render("admin/admin");
};
