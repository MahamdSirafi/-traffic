const licenseController = require("../controllers//licenseController");
const authController = require("../controllers/authController");
const express = require("express");
// const router = express.Router({ mergeParams: true });?
const router = express.Router();
router.route("/").get(authController.protect,authController.restrictTo("emp"),licenseController.formLicense)
.post(authController.protect,authController.restrictTo("emp"),licenseController.createLicense);
router.route("/update").get(authController.protect,authController.restrictTo("emp"),licenseController.getLicense)
.post(authController.protect,authController.restrictTo("emp"),licenseController.getLicensebyid);
router.route("/updateDate").patch(authController.protect,authController.restrictTo("emp"),licenseController.updatetrDatetLicense);
router.route("/updateClass").patch(authController.protect,authController.restrictTo("emp"),licenseController.updatetrClassLicense);
module.exports = router;