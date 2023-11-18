const Dates = require("../models/datesModel");
const Service = require("../models/serviceModel");
const Messag = require("../models/messagModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.getalldate = catchAsync(async (req, res, next) => {
  const today = new Date();
  const newDate = await Dates.find({
    date: {
      $gte: today.setHours(0, 0, 0, 0),
      $lt: today.setHours(23, 59, 59, 999),
    },
  })
    .populate({
      path: "user",
      select: "name national_number photo -_id",
    })
    .populate({
      path: "service",
      select: "service -_id",
    })
    .sort("service");
  res.status(200).json({ newDate });
});
//get One Date for search
exports.findName = catchAsync(async (req, res, next) => {
  const today = new Date();
  const newDate = await Dates.find({
    date: {
      $gte: today.setHours(0, 0, 0, 0),
      $lt: today.setHours(23, 59, 59, 999),
    },
  })
    .populate({
      path: "user",
      select: "name national_number photo -_id",
    })
    .populate({
      path: "service",
      select: "service -_id",
    })
    .sort("service");
  let findDate = null;
  newDate.forEach((item) => {
    if (
      item.user.name == req.params.name ||
      item.user.national_number == parseInt(req.params.name)
    ) {
      findDate = item;
      return 0;
    }
  });
  if (findDate == null) {
    res.status(404).json({ status: "err", messag: "لا يوجد موعد مطابق لبحثك" });
  } else {
    res.json({ status: "success", findDate });
  }
});
//create Date
exports.servicesExecution = catchAsync(async (req, res, next) => {
  //1)البحث عن حجذ سابق لنفس الشخص وعللا نفس الخدمة
  let found = await Dates.findOne({
    user: req.user._id,
    service: req.params.id,
  }).sort({ Date: -1 });
  if (found.date >= new Date()) {
    next(new AppError("انت تمتلك حجز مسبق لهذه الخدمة", 400));
  }
  //2) تحديد زمن المتاح لهذه الخدمة
  const newservice = await Service.findOne({ number: req.params.id });
  let text;
  //كود محاكات
  // let date = new Date(
  //   Date.now() + 1000 * 60 * 60 * 24 * Math.round(Math.random() * 10)
  // );
  let size = await Dates.aggregate([
    {
      $match: { service: req.params.id },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: -1 },
    },
  ]);
  let messagDate;
  if (size[0].count < newservice.max) {
    messagDate = myDate(new Date(size[0]._id));
  } else {
    messagDate = myDate(new Date(size[0]._id));
    messagDate.setDate(messagDate.getDate() + 1);
  }
  //3)تثبيت حجز الموعد بقاعدة البيانات
  await Dates.create({
    user: req.user._id,
    service: req.params.id,
    date: messagDate,
  });
  //4)انشاء رسالة بقاعدة البيانات لأرسالها الى المستخدم
  text = `لقد تم حجز موعد لك من اجل ${newservice.service} لدى ادارة فرع المرور في حلب\nيرجى الحضور بتاريخ :${messagDate}`;
  await Messag.create({ user: req.user._id, messag: text });
  res.status(201).json({ status: "success", messag: text });
});
let myDate = (date) => {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    // calendar:'islamic'
    calendar: "gregory",
  };
  let formatter = new Intl.DateTimeFormat("ar-SA", options);
  return formatter.format(date);
};
