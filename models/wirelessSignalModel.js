const mongoose = require("mongoose");

const wirelessSignalSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [
        true,
        "A wireless signal must have a brand",
      ],
    },
    model: {
      type: String,
      required: [
        true,
        "A wireless signal must have a model",
      ],
    },
    productType: {
      type: String,
      default: "wireless signal",
    },
    productTypeSpec: {
      type: String,
      required: [
        true,
        "A wireless signal must have a product type spec",
      ],
      enum: {
        values: ["receiver", "transmitter"],
        message:
          "A wireless signal is either: receiver or transmitter",
      },
    },
    signalType: [
      {
        type: String,
        required: [
          true,
          "A wireless signal must have a signal type",
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
    price: {
      type: Number,
      required: [
        true,
        "A wireless signal must have a price",
      ],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A wireless signal must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [
        true,
        "A wireless signal must have a inventory",
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

wirelessSignalSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

wirelessSignalSchema
  .virtual("documentType")
  .get(function () {
    return "WirelessSignal";
  });

wirelessSignalSchema.pre(/^find/, function (next) {
  this.populate({
    path: "accessory.accessoryId",
    select: "-__v",
  });
  next();
});

const WirelessSignal = mongoose.model(
  "WirelessSignal",
  wirelessSignalSchema
);

module.exports = WirelessSignal;
