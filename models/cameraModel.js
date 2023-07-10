const mongoose = require("mongoose");
const slugify = require("slugify");

const cameraSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "A camera must have a brand"],
    },
    model: {
      type: String,
      required: [true, "A camera must have a model"],
    },
    // type: {
    //   type: String,
    //   required: [true, "A camera must have a type"],
    //   enum: {
    //     values: ["motion camera", "camera"],
    //     message:
    //       "Camera type is either: motion camera or camera",
    //   },
    // },
    productType: {
      type: String,
      default: "camera",
    },
    productTypeSpec: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "A camera must have a price"],
    },
    imageSRC: {
      type: String,
      required: [true, "A camera must have a image source"],
    },
    inventory: {
      type: Number,
      required: [true, "A camera must have a inventory"],
    },
    sensorSize: {
      type: String,
      required: [true, "A camera must hava a sensor size"],
      enum: {
        values: ["super-35", "full-frame"],
      },
    },
    lensMount: {
      type: String,
      required: [
        true,
        "A camera mount is either: pl mount, rf mount, ef mount, e mount",
      ],
      enum: {
        values: ["pl", "rf", "ef", "e"],
      },
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

cameraSchema.virtual("name").get(function () {
  return this.brand + " " + this.model;
});
//別的地方referencing的時候this會失聯

cameraSchema.virtual("documentType").get(function () {
  return "Camera";
});

// cameraSchema.virtual("rig", {
//   ref: "Rig",
//   foreignField: "camera",
//   localField: "_id",
// });

cameraSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "rig",
  //   select: "-__v",
  // });
  this.populate({
    path: "accessory.accessoryId",
    select: "-__v",
  });
  next();
});

const Camera = mongoose.model("Camera", cameraSchema);

module.exports = Camera;
