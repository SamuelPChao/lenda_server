// node dev-data/data/import-dev-data.js --import
const fs = require("fs");
const mongoose = require("mongoose");
// const Battery = require("../../models/batteryModel");
// const Camera = require("../../models/cameraModel");
// const Filter = require("../../models/filterModel");
// const FollowFocus = require("../../models/followFocusModel");
// const Lens = require("../../models/lensModel");
// const MatteBox = require("../../models/matteBoxModel");
// const Monitor = require("../../models/monitorModel");
// const Rig = require("../../models/rigModel");
// const Storage = require("../../models/storageModel");
// const Tripod = require("../../models/tripodModel");
const WirelessSignal = require("../../models/wirelessSignalModel");
// const Booking = require("../../models/bookingModel");
// const News = require("../../models/newsModel");

require("dotenv").config({
  path: "./config.env",
});
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.PASSWORD
);

mongoose.connect(DB).then((con) => {
  console.log("DB connection connected");
});

//Read JSON FILE
// const cameras = JSON.parse(
//   fs.readFileSync(`${__dirname}/cameras.json`, "utf-8")
// );
// const lenses = JSON.parse(
//   fs.readFileSync(`${__dirname}/lenses.json`, "utf-8")
// );
// const tripods = JSON.parse(
//   fs.readFileSync(`${__dirname}/tripods.json`, "utf-8")
// );
// const filters = JSON.parse(
//   fs.readFileSync(`${__dirname}/filters.json`, "utf-8")
// );
// const followfocuses = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/followfocuses.json`,
//     "utf-8"
//   )
// );
// const matteBoxes = JSON.parse(
//   fs.readFileSync(`${__dirname}/matteBoxes.json`, "utf-8")
// );
// const monitors = JSON.parse(
//   fs.readFileSync(`${__dirname}/monitors.json`, "utf-8")
// );
// const wirelessSignals = JSON.parse(
//   fs.readFileSync(
//     `${__dirname}/wirelessSignals.json`,
//     "utf-8"
//   )
// );
// const rigs = JSON.parse(
//   fs.readFileSync(`${__dirname}/rigs.json`, "utf-8")
// );
// const bookings = JSON.parse(
//   fs.readFileSync(`${__dirname}/bookings.json`, "utf-8")
// );
// const newses = JSON.parse(
//   fs.readFileSync(`${__dirname}/news.json`, "utf-8")
// );

// const storages = JSON.parse(
//   fs.readFileSync(`${__dirname}/storages.json`, "utf-8")
// );
// const batteries = JSON.parse(
//   fs.readFileSync(`${__dirname}/batteries.json`, "utf-8")
// );

//LOAD DATA INTO DB
const importData = async () => {
  try {
    await Camera.create(cameras);
    // await Lens.create(lenses);
    // await Tripod.create(tripods);
    // await Filter.create(filters);
    // await FollowFocus.create(followfocuses);
    // await MatteBox.create(matteBoxes);
    // await Monitor.create(monitors);
    // await WirelessSignal.create(wirelessSignals);
    // await Rig.create(rigs);
    // await News.create(newses);
    // await Storage.create(storages);
    // await Battery.create(batteries);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE DATA FROM DB
const deleteData = async () => {
  try {
    await Camera.deleteMany();
    // await Lens.deleteMany();
    // await Tripod.deleteMany();
    // await Filter.deleteMany();
    // await Monitor.deleteMany();
    // await Storage.deleteMany();
    // await Battery.deleteMany();
    // await Rig.deleteMany();
    // await Booking.deleteMany();
    // await News.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}

if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
