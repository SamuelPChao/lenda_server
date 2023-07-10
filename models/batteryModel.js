const mongoose = require("mongoose");

const batterySchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A battery must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A battery must have a model"],
    },
    productType: {
      type: String,
      default: "battery",
    },
    price: {
      type: Number,
      required: [true, "A battery must have a price"],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A battery must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [true, "A battery must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

batterySchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

batterySchema.virtual("documentType").get(function () {
  return "Battery";
});

const Battery = mongoose.model("Battery", batterySchema);

module.exports = Battery;
