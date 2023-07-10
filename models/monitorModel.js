const mongoose = require("mongoose");

const monitorSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A monitor must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A monitor must have a model"],
    },
    productType: {
      type: String,
      default: "monitor",
    },
    productTypeSpec: {
      type: String,
      required: [
        true,
        "A monitor must have a product type spec",
      ],
    },
    signalType: [
      {
        type: String,
        required: [
          true,
          "A monitor must have a signal type",
        ],
        enum: {
          values: ["hdmi", "sdi"],
        },
      },
    ],
    accessory: [
      {
        accessoryId: {
          type: mongoose.Schema.ObjectId,
          ref: function () {
            return this.accessoryRef;
          },
        },
        accessoryRef: {
          type: String,
        },
      },
    ],
    monitorSize: {
      type: Number,
      required: [true, "A monitor must have a size"],
    },
    price: {
      type: Number,
      required: [true, "A monitor must have a price"],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A monitor must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [true, "A monitor must have a inventory"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

monitorSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

monitorSchema.virtual("documentType").get(function () {
  return "Monitor";
});

monitorSchema.pre(/^find/, function (next) {
  this.populate({
    path: "accessory.accessoryId",
    select: "-__v",
  });
  next();
});

const Monitor = mongoose.model("Monitor", monitorSchema);
module.exports = Monitor;
