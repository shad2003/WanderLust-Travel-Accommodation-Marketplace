const express = require('express');
const router = express.Router({mergeParams : true});  // to use parents route id in child parent route:/listings/:id/reviews , child route:"/","/:reviewId
const {reviewSchema} = require("../schema.js");
const Review = require("../model/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../model/listing.js");
const {validateReview,isLoggedin,isReviewAuthor}  = require("../middleware.js");
const reviewController = require("../controllers/review.js");



 //Post route for review

 router.post("/",validateReview,isLoggedin,wrapAsync(reviewController.createReview));

 // Delete route for review

 router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview));

 module.exports = router;