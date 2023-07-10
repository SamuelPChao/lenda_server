const mongoose = require("mongoose");

const rigSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A rig must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A rig must have a model"],
    },
    camera: {
      type: mongoose.Schema.ObjectId,
      ref: "Camera",
      required: [true, "A rig must belong to a camera"],
    },
    productType: {
      type: String,
      default: "rig",
    },
    price: {
      type: Number,
      required: [true, "A rig must have a price"],
    },
    imageSRC: {
      type: String,
      required: [true, "A rig must have a image source"],
    },
    inventory: {
      type: Number,
      required: [true, "A rig must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
rigSchema.virtual("documentType").get(function () {
  return "Rig";
});

rigSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

const Rig = mongoose.model("Rig", rigSchema);
module.exports = Rig;
