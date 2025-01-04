const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    // redirectURL save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in !");
    return res.redirect("/login");
  }
  next();
};

// Post Login url(middleware)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Authorization(edit/delete)
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  // Edit Route Authorization
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Permission denied !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Validate Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // console.log(error);
    let errMsg = error.details.map((el) => el.message).join(", ");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validate Review
module.exports.validateReview = (req, res, next) => {
  console.log("Request body:", req.body);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Authorization (delete)
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  // Edit Route Authorization
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Permission denied !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
