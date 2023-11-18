const Messag = require("../models/messagModel");
const car = require("../models/carModel");
const violation = require("../models/violationModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
exports.showmessag = catchAsync(async (req, res, next) => {
  const iduser = req.user._id;
  const newmessag = await Messag.find({ user: iduser })
    .populate({
      path: "user",
    })
    .sort({ createdAt: -1 });
  newmessag.forEach(async (item) => {
    item.read = true;
    await item.save();
  });
  res.render("user/messaguser", { newmessag: newmessag });
});
exports.deleteMessag = (req, res, next) => {
  Messag.findByIdAndDelete(req.params.id)
    .then((params) => {
      res.json({ mylink: "/messag" });
    })
    .catch((err) => {
      return next(new AppError(`لم تتم عملية الحذف  : ${err}`, 400));
    });
};
// exports.deleteMessag=factory.deleteOne(Messag);
exports.unreadCount = catchAsync(async (req, res, next) => {
  if (req.user._id === null) {
    res.locals.unreadCount = null;
    next();
  }
  const userId = req.user._id;
  const unreadCount = await Messag.find({ read: false, user: userId }).count();
  res.locals.unreadCount = unreadCount == 0 ? null : unreadCount;
  next();
});
exports.deleteviolation = catchAsync(async (req, res, next) => {
  let newViolation = await violation
    .findOne({ _id: req.params.id })
    .populate({ path: "violation" });
  let cars = await car.findOne({ plate_number: newViolation.plate_number });
  // ارسال رسالة لصاحب المركبة
  let user = await User.find({ national_number: cars.national_number });
  await Messag.create({
    user: user[0]._id,
    messag: `لقد تم قبول طلب إعتراضك وتم إلغاء المخالفة ${newViolation.violation.type}`,
    createdAt: new Date(),
  });
  next();
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  let newViolation = await violation
    .findOne({ _id: req.params.id })
    .populate({ path: "violation" });
  // console.log(newViolation);
  let cars = await car.findOne({ plate_number: newViolation.plate_number });
  // ارسال رسالة لصاحب المركبة
  let user = await User.find({ national_number: cars.national_number });
  await Messag.create({
    user: user[0]._id,
    messag: `لقد تم رفض طلب إعتراضك على مخالفة ${newViolation.violation.type}`,
    createdAt: new Date(),
  });
  res.json({ status: "success" });
});
