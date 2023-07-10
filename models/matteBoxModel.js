const mongoose = require("mongoose");

const matteBoxSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A matte box must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A matte box must have a model"],
    },
    productType: {
      type: String,
      required: [
        true,
        "A matte box must have a product type",
      ],
    },
    filterSize: {
      type: Number,
      required: [true, "A matte box must have filter size"],
      enum: [5.65, 6.6],
    },
    filterQuantity: {
      type: Number,
      required: [
        true,
        "A matte box must have filter quantity",
      ],
    },
    price: {
      type: Number,
      required: [true, "A matte box must have a price"],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A matte box must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [true, "A matte box must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

matteBoxSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

matteBoxSchema.virtual("documentType").get(function () {
  return "MatteBox";
});

const MatteBox = mongoose.model("MatteBox", matteBoxSchema);

module.exports = MatteBox;
