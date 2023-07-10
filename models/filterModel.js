const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A filter must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A filter must have a model"],
    },
    productType: {
      type: String,
      required: [true, "A filter must have a product type"],
    },
    productTypeSpec: {
      type: String,
      required: [
        true,
        "A filter must have a product type spec",
      ],
      enum: {
        values: [
          "pl",
          "nd",
          "diffusion",
          "color",
          "effect",
        ],
      },
    },
    filterSize: {
      type: Number,
      required: [true, "A filter must have a size"],
      enum: {
        values: [5.65, 6.6],
        message: "A filter size is either: 5.65 or 6.6",
      },
    },
    price: {
      type: Number,
      required: [true, "A filter must have a price"],
    },
    imageSRC: {
      type: String,
      required: [true, "A filter must have a image source"],
    },
    inventory: {
      type: Number,
      required: [true, "A filter must have a inventory"],
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

filterSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});

filterSchema.virtual("documentType").get(function () {
  return "Filter";
});

filterSchema.pre(/^find/, function (next) {
  this.populate({
    path: "accessory.accessoryId",
    select: "-__v",
  });
  next();
});

const Filter = mongoose.model("Filter", filterSchema);

module.exports = Filter;
