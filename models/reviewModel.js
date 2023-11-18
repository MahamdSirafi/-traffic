// review / rating / createdAt / ref to tour / ref to user
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "الرجاء ملئ محتوى الشكوة"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "لم يتم تحديد صاحب الشكوة"],
    unique: false,
  },
  violation: {
    type: mongoose.Schema.ObjectId,
    ref: "violation",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// reviewSchema.index({ review: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// findByIdAndUpdate
// findByIdAndDelete
// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
