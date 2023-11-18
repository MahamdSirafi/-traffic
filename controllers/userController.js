// const multer = require("multer");
// const sharp = require("sharp");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const { findByIdAndUpdate } = require("../models/messagModel");
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only images.", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   next();
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "national_number");
  if (req.body.photo != "null") filteredBody.photo = req.body.photo;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.locals.user = updatedUser;
  res.json({ url: "/view/me" });
});

exports.deleteuser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let newUser;
  if (req.body.role === "شرطي") {
    req.body.role = "officer";
    newUser = await User.create(req.body);
    //  const url = `${req.protocol}://${req.get("host")}/me`;
    //  await new Email(newUser, url).sendWelcome();
    res.redirect(`/view/mgr`);
    // res.json({status:"saccses"})
  } else {
    req.body.role = "emp";
    newUser = await User.create(req.body);
    //  const url = `${req.protocol}://${req.get("host")}/me`;
    //  await new Email(newUser, url).sendWelcome();
    res.redirect(`/view/mgr`);
    // res.json({status:"saccses"})
  }
});
////////////////////////////////
exports.createuser = (req, res) => {
  res.render("mgr/createuser");
};
exports.getAllemp = catchAsync(async (req, res, next) => {
  const emp = await User.find({ role: "emp" });
  const officer = await User.find({ role: "officer" });
  res.render("mgr/allEmp", { emp, officer });
});
//////////////////////////////////////
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false }).then(
    (params) => {
      res.json({ status: "success" });
    }
  );
});
exports.getUserName = catchAsync((req, res, next) => {
  const newuser = User.findOne({ name: req.params.name });
  if (!newuser) {
    return next(new AppError("الرجاء التحقق من الأسم المدخل ", 404));
  } else {
    res.status(200).json({
      status: "success",
      newuser,
    });
  }
});
