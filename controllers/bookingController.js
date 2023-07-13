const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createBooking = catchAsync(
  async (req, res, next) => {
    const doc = await Booking.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);

exports.getBooking = catchAsync(async (req, res, next) => {
  const doc = await Booking.findById(req.params.id)
    .populate({ path: "user", select: "_id name phone" })
    .populate({
      path: "cart.product",
      strictPopulate: false,
    });
  if (!doc) {
    // return next(
    //   new AppError("No booking found with the id", 404)
    // );
    return res.status(404).json({
      status: "no booking found with the id",
      data: null,
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

// exports.getBookingsByUserId = catchAsync(
//   async (req, res, next) => {
//     const doc = await Booking.find({
//       user: req.body.id,
//     }).populate({
//       path: "cart.product",
//       strictPopulate: false,
//     });
//     if (!doc) {
//       return next(
//         new AppError("No booking found with the id", 404)
//       );
//     }
//     res.status(200).json({
//       status: "success",
//       data: {
//         doc,
//       },
//     });
//   }
// );

exports.getAllBookings = catchAsync(
  async (req, res, next) => {
    console.log(req.params);
    let filter = {};
    if (req.params.userId) {
      filter = { user: req.params.userId };
      // console.log(req.params);
    }
    const doc = await Booking.find(filter).sort({
      createAt: -1,
    });
    if (!doc) {
      // return next(new AppError("No booking found", 404));
      return res.status(404).json({
        status: "booking not found",
        data: null,
      });
    }
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        doc,
      },
    });
  }
);

exports.updateBooking = catchAsync(
  async (req, res, next) => {
    const doc = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!doc) {
      // return next(
      //   new AppError("No booking found with the id", 404)
      // );
      return res.status(404).json({
        status: "booking not found",
        data: null,
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  }
);

exports.deleteBooking = catchAsync(
  async (req, res, next) => {
    const doc = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        canceled: true,
      }
    );
    if (!doc) {
      return res.status(404).json({
        status: "booking not found",
        data: null,
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
