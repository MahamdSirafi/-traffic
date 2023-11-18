const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const Messag = require("./../models/messagModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("./../utils/email");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.redirect(`/view/${user.role}`);
};

exports.getsignup = catchAsync(async (req, res, next) => {
  res.render("logup");
});
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();
  await Messag.create({
    user: newUser._id,
    messag: `مرجبا بك في الموقع الرسمي لمديرية فرع المرور بحلب`,
  });
  createSendToken(newUser, 201, req, res);
});

exports.getlogin = (req, res) => {
  res.render("login");
};

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("الرجاء إدخال  كلمة السر و الإيميل", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(" عذرا الرجاء التحقق من كلمة السر او الإيميل", 401)
    );
  }
  //return
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  // res.locales.user={role:null};
  res.status(200).redirect("/view");
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token) {
    return next(new AppError("الرجاء تسجيل الدخول ", 401));
  }

  // // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("رمز العبور غير صالح", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("لقد تم تغيير كلمة السر الرجاء معاودة تسجيل الدخول", 401)
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        req.user = { _id: null };
        res.locals.user = { role: null };
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        res.locals.user = { role: null };
        req.user = { _id: null };
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      res.locals.user = { role: null };
      req.user = { _id: null };
      return next();
    }
  }
  req.user = { role: null };
  res.locals.user = { role: null };
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'emp']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("انت لا تمتلك سماحية الوصول إلى هذا المورد", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        " لا يوجد حساب لهذا الإيميل قم بإنشاء حساب جديد أو تحقق من الإيميل الخاص بك",
        404
      )
    );
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/users/resetPassword/${resetToken}`;
    // console.log(resetURL);

    //يجب اعادة تشغيلاها قبل مناقشة النهائيلة
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      // url: `/users/resetPassword/${resetToken}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "لقد حصل خطئ في إرسال الإيميل الرجاء المحاولة مرة أخرة أو التحقق من الشبكة"
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //  console.log(user);
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("الرمز التحقق غير صحيح", 400));
  }
  // console.log(user);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // console.log(user);
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.json({ status: "success", url: `/view/${user.role}` });
  // createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  // console.log(req.user.id);
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("كلمة السر التحقق غير صحيحة", 401));
  }
  // console.log(user);
  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;
  res.json({ url: "/view/me" });
});
