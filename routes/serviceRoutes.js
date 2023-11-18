// @ts-check
const express = require("express");
 const serviceController = require("./../controllers/serviceController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.use(authController.protect,authController.restrictTo("admin"));
router.route("/").get(serviceController.getallService).post(serviceController.create);
router.route("/:id").get(serviceController.getService).patch(serviceController.updateService).delete(serviceController.deleteService);
module.exports = router;