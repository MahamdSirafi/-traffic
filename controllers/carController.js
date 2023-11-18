const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const car = require("../models/carModel");
exports.getupdatecar = catchAsync(async (req, res, next) => {
  let findcar = await car.find({ plate_number: req.params.id });
  let newcar = findcar[0];
  // console.log(newcar);
  if(newcar){
  res.render("emp/updatecar", { newcar });
  }
  else{
    res.render("error", { msg:'رقم اللوحة غير صحيح' });
  }
  // res.render("emp/updatecar", { newcar });
});
exports.updatecar = catchAsync(async (req, res, next) => {
  let newcar1 = await car.find({ plate_number: req.params.id });
  let newcar = await car.findByIdAndUpdate(newcar1[0]._id, req.body);
  res.json({  status:"success", mylink: "/view/emp/updatecar" });
});
exports.createCar = catchAsync(async (req, res, next) => {
  const newCar = await car.create(req.body);
  res.json({  status:"success", url: "/view/emp" });
});