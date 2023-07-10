const mongoose = require("mongoose");

const followFocusSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A follow focus must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A follow focus must have a model"],
    },
    productType: {
      type: String,
      default: "follow focus",
    },
    price: {
      type: Number,
      required: [true, "A follow focus must have a price"],
    },
    imageSRC: {
      type: String,
      required: [
        true,
        "A follow focus must have a image source",
      ],
    },
    inventory: {
      type: Number,
      required: [
        true,
        "A follow focus must have a inventory",
      ],
    },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

followFocusSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

followFocusSchema.virtual("documentType").get(function () {
  return "FollowFocus";
});

followFocusSchema.pre(/^find/, function (next) {
  this.populate({
    path: "accessory.accessoryId",
    select: "-__v",
  });
  next();
});

const FollowFocus = mongoose.model(
  "FollowFocus",
  followFocusSchema
);

module.exports = FollowFocus;
