const authController = require("../controllers/authController");
const messagController = require("../controllers/messagControllre");
const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const reviewController = require("../controllers/reviewCcontroller");
const dateController = require("./../controllers/dateController");

//Routes
// const DateRoutes = require("./../routes/dateRoutes");
const userRoutes = require("./../routes/userRoutes");
const licenseRoutes = require("./../routes/licenseRoutes");
const violationRoutes = require("./../routes/violationRoutes");
const carRoutes = require("./../routes/carRoutes");
const dataRoutes = require("./../routes/dateRoutes");
//public
router.route("/me").get(authController.protect, viewController.getAccount);
router
  .route("/information")
  .get(
    authController.isLoggedIn,
    messagController.unreadCount,
    viewController.information
  );
router
  .route("/user/services")
  .get(
    authController.isLoggedIn,
    messagController.unreadCount,
    viewController.userservice
  );
//user
router
  .route("/")
  .get(
    authController.isLoggedIn,
    messagController.unreadCount,
    viewController.home
  );
router
  .route("/user")
  .get(
    authController.isLoggedIn,
    messagController.unreadCount,
    viewController.home
  );
router
  .route("/user/mtn/:sum/:id")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    messagController.unreadCount,
    viewController.MtnCash
  );
router
  .route("/user/Syriatel/:sum")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    messagController.unreadCount,
    viewController.SyriatelCash
  );
router.use("/user/violation", violationRoutes);
router.use("/user", dataRoutes);
//officer
router
  .route("/officer")
  .get(
    authController.protect,
    authController.restrictTo("officer"),
    viewController.getform
  );
router.use("/officer", violationRoutes);

//admin
router
  .route("/admin")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    viewController.Dashboard
  );
router
  .route("/admin/review")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    reviewController.getAllreview
  );
//mgr
router.use("/mgr", userRoutes);
//emp

router
  .route("/emp")
  .get(
    authController.protect,
    authController.restrictTo("emp"),
    viewController.getcreateCar
  );
router
  .route("/emp/updatecar")
  .get(
    authController.protect,
    authController.restrictTo("emp"),
    viewController.findcar
  );
router.use("/emp", carRoutes);
router.use("/emp/license", licenseRoutes);

router.use("/emp2", dataRoutes);

// router
//   .route("/emp2")
//   .get(
//     authController.protect,
//     authController.restrictTo("emp2"),
//     dateController.getalldate
//   );

module.exports = router;
