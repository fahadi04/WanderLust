const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "default-image",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1542397284385-6010376c5337?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    //Schema validators
    // set: (v) =>
    //   v === ""
    //     ? "https://unsplash.com/photos/white-yacht-in-middle-of-blue-sea-qToVxSYXPYU"
    //     : v,
  },
  price: {
    type: Number,
    // required: true,
    min: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Listing Delete Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
