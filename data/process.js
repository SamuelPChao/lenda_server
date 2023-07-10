// node dev-data/data/process.js
const fs = require("fs");
const mongoose = require("mongoose");
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/forModify.json`, "utf-8")
);
const Camera = require("../../models/cameraModel");

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
// console.log(data[17]);
const modifiedData = data.map((obj) => {
  const { rig, accessory, ...rest } = obj;
  let productTypeSpec = "";
  if (rig.length > 0) {
    rig.forEach((element) => {
      accessory.push({
        accessoryId: element._id,
        accessoryRef: element.documentType,
      });
    });
  }
  return {
    accessory,
    ...rest,
  };
});
console.log(modifiedData[17]);

// console.log(modifiedData[0]);

const importData = async () => {
  try {
    await Camera.create(modifiedData);
    // await Lens.create(modifiedData);
    // await Tripod.create(modifiedData);
    // await Filter.create(modifiedData);
    // await FollowFocus.create(modifiedData);
    // await MatteBox.create(modifiedData);
    // await Monitor.create(modifiedData);
    // await WirelessSignal.create(modifiedData);
    // await Rig.create(rigs);
    // await News.create(newses);
    // await Storage.create(modifiedData);
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
    // await MatteBox.deleteMany();
    // await WirelessSignal.deleteMany();
    // await Storage.deleteMany();
    // await Battery.deleteMany();
    // await Rig.deleteMany();
    // await Booking.deleteMany();
    // await News.deleteMany();
    // await FollowFocus.deleteMany();
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
