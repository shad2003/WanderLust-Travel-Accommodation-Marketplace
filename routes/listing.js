const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../model/listing.js");
const {isOwner,validateListing,isLoggedin}  = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

router
.route("/")
.get(wrapAsync(listingcontroller.index))                                                     // Index Route
.post(isLoggedin,upload.single('listing[image][url]'),validateListing, wrapAsync(listingcontroller.createListing));               // create route


 

router.get("/new",isLoggedin,listingcontroller.renderNewForm)

router
.route("/:id")
.get(wrapAsync(listingcontroller.showListing))                                         //show route
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.updateListing))    // update route
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.deleteListing));                // delete route
 
 //edit route

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingcontroller.editListing));

 module.exports = router;