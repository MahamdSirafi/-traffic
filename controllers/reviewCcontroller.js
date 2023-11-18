const review = require("./../models/reviewModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const violation = require("./../models/violationModel");
exports.getAllreview = catchAsync(async (req, res, next) => {
  const list = await review.find().sort({ createdAt: -1 });
  // console.log(list);
  res.render("admin/review", { list });
});
exports.createreview = catchAsync(async (req, res, next) => {
  if (req.body.violation) {
    await violation.findOneAndUpdate(
      { _id: req.body.violation },
      {
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 16,
      }
    );

    await review.create({
      review: req.body.review,
      violation: req.body.violation,
      user: req.body.user,
      createdAt: Date.now(),
    });
  } else {
    await review.create({
      review: req.body.review,
      user: req.body.user,
      createdAt: Date.now(),
    });
  }
  res.json({ url: "/view" });
});
exports.deletereview = factory.deleteOne(review);
