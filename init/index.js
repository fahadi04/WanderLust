const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Initialization of Owner for every listings
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67631d7cf6cef1c4e3a90472",
  }));
  // console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
