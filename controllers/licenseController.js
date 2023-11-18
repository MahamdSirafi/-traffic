const License = require("../models/licenseModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
exports.formLicense = catchAsync(async (req, res, next) => {
  res.render("emp/formLiscense");
});
exports.createLicense = catchAsync(async (req, res, next) => {
  const doc = await License.create(req.body);
  res
    .status(201)
    .render("success", {
      msg:"لقد تم اضافةرخصة بنجاح",
      
      url: "/view/emp/license",


    });
});

exports.getLicense = (req, res, next) => {
  res.render("emp/updateLicense");
};
exports.getLicensebyid = catchAsync(async (req, res, next) => {
  if(req.body.number==""){
    return next(new AppError("الرجاء التأكد  من رقم الرخصة", 400));
  }
  let newLicense = await License.find({ number: req.body.number });
  if (newLicense.length==0) {
    return next(new AppError("الرجاء التأكد  من رقم الرخصة", 400));
  }
  res.json({ 
    status:"success",
    License:newLicense[0]});
});

exports.updatetrDatetLicense = catchAsync(async (req, res, next) => {
  const updateLicense = await License.updateOne({ number: req.body.number },{expiryDate:Date.now() + 1000 * 60 * 60 * 24 * 30 * 12 * 8});
  res.json({
    status:"success",
    License:updateLicense})
  });
exports.updatetrClassLicense = catchAsync(async(req, res, next) => {
  const updateLicense = await License.updateOne({ number: req.body.number },{class:req.body.class});
  res.json({
    status:"success",
    License:updateLicense})
});

//exports.updateLicense = factory.updateOne(License);
//exports.deleteLicense = factory.deleteOne(License);

// exports.getLicense = factory.getOne(License);
// exports.getAllLicense = factory.getAll(License);
