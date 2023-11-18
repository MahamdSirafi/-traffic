const violation = require("./../models/violationModel");
const listviolation = require("./../models/listViolationModel");
const license = require("./../models/licenseModel");
const car = require("./../models/carModel");
const User = require("./../models/userModel");
const Messag = require("../models/messagModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
exports.getviolation = factory.getOne2(
  violation,
  {
    path: "user",
    select: "name national_number photo -_id",
  },
  { path: "violation", select: "-_id" }
);
exports.payviolation = catchAsync(async (req, res, next) => {
  const findViolation = await violation.findOne({
    plate_number: req.params.id,
  });
  if (findViolation) {
    const newViolation = await violation.find({ plate_number: req.params.id });
    newViolation.forEach(async (item) => {
      let pay = await violation.findByIdAndUpdate(
        {
          _id: item._id,
        },
        { paid: true }
      );
    });
    res.status(200).json({ status: "success" });
  } else {
    const findViolation = await violation.findByIdAndUpdate(
      { _id: req.params.id },
      { paid: true }
    );
    res.status(200).json({ status: "success" });
  }
});
exports.deleteviolation = factory.deleteOne(violation);
exports.createViolation = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const idViolation = await listviolation.findOne({
    type: `${req.body.violation}`,
  });
  if (!idViolation) {
    return next(new AppError('الرجاء التحقق من نوع المخالفة', 400));
  }
  const number = await license.findOne({ number: req.body.license });
  if (!number) {
    return next(new AppError("الرجاء التحقق من رقم الرخصة", 401));
  }
  // console.log(number);
  const data = {
    violation: idViolation._id,
    user: req.user._id,
    license: number._id,
    photo: req.body.photo,
    plate_number: req.body.plate_number,
    Location: {
      region: req.body.region,
      start: req.body.start,
    },
  };
  // console.log(data, req.user._id);
  // console.log(idViolation);
  // console.log(idViolation[0]._id);
  console.log(req.body.plate_number);
  let cars = await car.findOne({ plate_number: req.body.plate_number });
  // console.log(!cars);
  if (!cars) {
    return next(new AppError("لا يوجد مركبة تمتلك رقم اللوحة المدخل", 400));
  }
  const newviolation = await violation.create(data);
  // ارسال رسالة لصاحب المركبة
  let user = await User.find({ national_number: cars.national_number });
  if (user.length > 0) {
    await Messag.create({
      user: user[0]._id,
      messag: `لقد حصلت على مخالفة جديدة الرجاء التوجه الى مخالفات لمعرفة تفاصيل المخالفة`,
      createdAt: new Date()
    });
  }
  res.json({ status: "success", url: "/view/officer" });
});

exports.violation = catchAsync(async (req, res, next) => {
  // req.user.national_number = "2023053492";
  const data = [];
  const national_number = req.user.national_number;
  const caruser = await car.find({ national_number: national_number });

  for (const item of caruser) {
    let sum = 0;

    const carData = {
      name: item.name,
      model: item.model,
      plate_number: item.plate_number,
      arrViolation: [],
      sum: Number,
    };

    const violationuser = await violation
      .find({ plate_number: item.plate_number, paid: false })
      .populate({ path: "violation" })
      .populate({ path: "user" }).sort({createdAt:-1})
      .lean();

    for (const itemV of violationuser) {
      const violationData = {
        _id: itemV._id,
        Location: {
          region: itemV.Location.region,
          start: itemV.Location.start,
        },
        violation: {
          type: itemV.violation.type,
          cost: itemV.violation.cost,
        },
        photo: itemV.photo,
        createdAt: itemV.createdAt,
      };
      sum += itemV.violation.cost;

      carData.arrViolation.push(violationData);
    }
    carData.sum = sum;
    data.push(carData);
  }
  res.render("user/violation", { data });
});
