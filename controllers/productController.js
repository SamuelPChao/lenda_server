const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const models = {
  Battery: require("../models/batteryModel"),
  Camera: require("../models/cameraModel"),
  Filter: require("../models/filterModel"),
  FollowFocus: require("../models/followFocusModel"),
  Lens: require("../models/lensModel"),
  MatteBox: require("../models/matteBoxModel"),
  Monitor: require("../models/monitorModel"),
  Rig: require("../models/rigModel"),
  Storage: require("../models/storageModel"),
  Tripod: require("../models/tripodModel"),
  WirelessSignal: require("../models/wirelessSignalModel"),
};

// exports.getCamerasByBrand = catchAsync(
//   async (req, res, next) => {
//     const doc = await Camera.find({
//       brand: req.params.brand,
//     });
//     res.status(200).json({
//       status: "success",
//       data: {
//         doc,
//       },
//     });
//   }
// );

// exports.getAllCameras = catchAsync(
//   async (req, res, next) => {
//     const doc = await Camera.find();
//     res.status(200).json({
//       status: "success",
//       data: {
//         doc,
//       },
//     });
//   }
// );

exports.getProductByType = catchAsync(
  async (req, res, next) => {
    let Model;
    if (!req.params.type.includes("-")) {
      const modelName =
        req.params.type[0].toUpperCase() +
        req.params.type.slice(1);
      Model = models[modelName];
      console.log(Model);
    }
    if (req.params.type.includes("-")) {
      const modelName = req.params.type
        .split("-")
        .map((ele) => ele[0].toUpperCase() + ele.slice(1))
        .join("");
      Model = models[modelName];
    }
    const doc = await Model.find();
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "data not found",
        data: null,
      });
      // return next(
      //   new AppError("No product found with the type", 404)
      // );
    }

    // res.setHeader(
    //   "Access-Control-Allow-Origin",
    //   "https://8709-118-161-208-173.ngrok-free.app"
    // );
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);

exports.getProductByBrand = catchAsync(
  async (req, res, next) => {
    let Model;
    const brand = req.params.brand;
    if (req.params.type.includes("-")) {
      const modelName = req.params.type
        .split("-")
        .map((ele) => ele[0].toUpperCase() + ele.slice(1))
        .join("");
      Model = models[modelName];
    } else {
      modelName =
        req.params.type[0].toUpperCase() +
        req.params.type.slice(1);
      Model = models[modelName];
    }
    const doc = await Model.find({ brand: brand });
    if (!doc) {
      // return next(
      //   new AppError("No product found with the brand", 404)
      // );
      res.status(404).json({
        status: "error",
        message: "data not found",
        data: null,
      });
    }
    // res.setHeader(
    //   "Access-Control-Allow-Origin",
    //   "https://8709-118-161-208-173.ngrok-free.app"
    // );
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);
