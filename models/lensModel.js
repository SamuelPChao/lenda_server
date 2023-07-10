const mongoose = require("mongoose");

const lensSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A lens must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A lens must have a model"],
    },
    productType: {
      type: String,
      default: "lens",
    },
    productTypeSpec: {
      type: String,
    },
    // focal: {
    //   focalLength: {
    //     type: String,
    //     required: [true, "A lens must have a focal length"],
    //   },
    //   sensorSize: {
    //     type: String,
    //     required: [true, "A lens must have a sensorSize"],
    //     enum: {
    //       values: ["super-35", "full-frame"],
    //       message:
    //         "A sensorSize is either: super-35 or full-frame",
    //     },
    //   },
    //   zoom: {
    //     default: false,
    //     type: Boolean,
    //   },
    // },
    focalLength: {
      type: String,
      required: [true, "A lens must have a focal length"],
    },
    sensorSize: {
      type: String,
      required: [true, "A lens must have a sensorSize"],
      enum: {
        values: ["super-35", "full-frame"],
        message:
          "A sensorSize is either: super-35 or full-frame",
      },
    },
    aperture: {
      type: Number,
      required: [true, "A lens must have a aperture"],
    },
    price: {
      type: Number,
      required: [true, "A lens must have a price"],
    },
    imageSRC: {
      type: String,
      required: [true, "A lens must have a image source"],
    },
    inventory: {
      type: Number,
      required: [true, "A lens must have a inventory"],
    },
    lensMount: {
      type: String,
      required: [true, "A lens must have a lens mount"],
      enum: {
        values: ["pl", "rf", "ef", "e"],
        message:
          "Lens type is either: pl mount, rf mount, ef mount, e mount",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

lensSchema.virtual("name").get(function () {
  let apertureUnit;
  if (this.productTypeSpec.includes("cine")) {
    apertureUnit = "t";
  } else {
    apertureUnit = "f";
  }

  return (
    this.brand +
    " " +
    this.model +
    " " +
    this.focalLength +
    " " +
    apertureUnit +
    this.aperture
  );
});

lensSchema.virtual("documentType").get(function () {
  return "Lens";
});

const Lens = mongoose.model("Lens", lensSchema);

module.exports = Lens;
