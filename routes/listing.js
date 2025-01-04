const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
// initialize multer
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Handles GET requests
  .post(
    isLoggedIn,
    // Multer middleware
    upload.single("listing[image]"),
    validateListing,
    // wrapAsync(async (req, res) => {
    //   // Handle the uploaded file and validated data
    //   await listingController.createListing(req, res);
    //   res.redirect("/listings"); // Redirect after successful creation
    // })
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
