const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A storage must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A storage must have a model"],
    },
    productType: {
      type: String,
      required: [
        true,
        "A storage must have a product type",
      ],
    },
    productTypeSpec: {
      type: String,
      required: [
        true,
        "A storage must have a product type spec",
      ],
    },
    storageSize: {
      type: Number,
      required: [true, "A storage must have a size"],
    },
    price: {
      type: Number,
      required: [true, "A storage must have a price"],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A storage must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [true, "A storage must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storageSchema.virtual("name").get(function () {
  return (
    this.brand + " " + this.model + " " + this.storageSize + " gb"
  );
});

storageSchema.virtual("documentType").get(function () {
  return "Storage";
});

const Storage = mongoose.model("Storage", storageSchema);
module.exports = Storage;
