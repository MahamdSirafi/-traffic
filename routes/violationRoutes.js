const express = require('express');
const router = express.Router();
const authController=require('../controllers/authController') 
const violationController=require("../controllers/violationController");
const messagController = require("../controllers/messagControllre");
const messagControllre=require("../controllers/messagControllre");
router
   .route('/').get(
    authController.protect,
    authController.restrictTo("user"),
    messagController.unreadCount,
    violationController.violation
  )
.post(
  authController.protect,
  authController.restrictTo("officer"),
  violationController.createViolation
);  
router
   .route('/:id')
   .get(violationController.getviolation)
   .post(violationController.payviolation)
   .delete(messagControllre.deleteviolation,violationController.deleteviolation);
   router
module.exports = router;