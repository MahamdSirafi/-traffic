// @ts-check
const express = require("express");
const dateController = require("./../controllers/dateController");
const authController = require("./../controllers/authController");
const router = express.Router();
router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("emp2"),
    dateController.getalldate
  );
router
  .route("/:name")
  .get(
    authController.protect,
    authController.restrictTo("emp2"),
    dateController.findName
  );
router
  .route("/services/:id")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    dateController.servicesExecution
  );

module.exports = router;
