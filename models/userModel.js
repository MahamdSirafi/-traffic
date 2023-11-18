const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "لم يتم تحديد اسم المستخدم"],
  },
  email: {
    type: String,
    required: [true, "لم يتم تحديد ايميل المستخدم"],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      "هذا الايميل غير صالح الرجاء اعادة تعيين الايميل",
    ],
  },
  photo: {
    type: String,
    default: "2986e60c48bffa2bcf13ba3c06517deb.jpg",
  },
  role: {
    type: String,
    enum: ["user", "officer", "emp", "admin", "mgr","emp2"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "الرجاء ادخال كلمة سر مؤلفة من 8 محارف على الاقل"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "الرجاء اعادة تاكيد كلمة المرور"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "لم يتم مطابقة كلمة السر الرجاء اعادة التاكيد",
    },
  },
  national_number: {
    type: Number,
    required: [true, "لم يتم تحديد الرقم الوطني الرجاء اعادة الادخال"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  //   if (!this.isModified("national_number")) return next();
  //   this.national_number = await bcrypt.hash(this.national_number, 12);
  //   if (!this.isModified("national_number")) return next();
  //   this.role = await bcrypt.hash(this.role+this.createdAt, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp,JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
