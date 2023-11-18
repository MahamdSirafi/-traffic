const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const carController = require("../controllers/carController");
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("emp"),
    carController.createCar
  );
router
  .route("/updatecar/:id")
  .get(
    authController.protect,
    authController.restrictTo("emp"),
    carController.getupdatecar
  )
  .patch(
    authController.protect,
    authController.restrictTo("emp"),
    carController.updatecar
  );
module.exports = router;
