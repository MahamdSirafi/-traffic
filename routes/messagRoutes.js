const messagController = require("../controllers/messagControllre");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();
router.route("/").get(authController.protect,authController.restrictTo("user"),messagController.showmessag);
router.route("/:id").delete(authController.protect,authController.restrictTo("user"),messagController.deleteMessag);
router.route("/violations/:id").delete(messagController.deleteReview);
module.exports = router;