const express = require('express');
const router = express.Router();
const reviewController=require("../controllers/reviewCcontroller");
  router
   .route('/')
   .get(reviewController.getAllreview)
   .post(reviewController.createreview);
   router
   .route('/:id')
   .delete(reviewController.deletereview)
module.exports = router;