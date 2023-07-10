const mongoose = require("mongoose");

const tripodSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A tripod must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A tripod must have a model"],
    },
    tripodSize: {
      type: Number,
      required: [true, "A tripod must have a size"],
      enum: {
        values: [75, 100, 150],
        message: "A tripod size is either: 75, 100 or 150",
      },
    },
    productType: {
      type: String,
      required: [true, "A tripod must have a product type"],
    },
    price: {
      type: Number,
      required: [true, "A accessory must have a price"],
    },
    imageSRC: {
      type: String,
      required: [true, "A tripod must have a image source"],
    },
    inventory: {
      type: Number,
      required: [true, "A tripod must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tripodSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

tripodSchema.virtual("documentType").get(function () {
  return "Tripod";
});

const Tripod = mongoose.model("Tripod", tripodSchema);

module.exports = Tripod;
