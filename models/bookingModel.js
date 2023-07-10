const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    cart: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: function () {
            return this.documentType;
          },
          requried: [true, "Product id is needed"],
        },
        documentType: {
          type: String,
          required: [true, "Document type is needed"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is need"],
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A booking must belong to a user"],
    },
    totalPrice: {
      type: Number,
      required: [true, "A booking must have a total price"],
    },
    companyTitle: {
      type: String,
    },
    companyVatId: {
      type: String,
    },
    date: [
      {
        type: Date,
        required: [true, "A booking must have a date"],
      },
    ],
    duration: {
      type: Number,
      required: [true, "A booking must have a duration"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    checked: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookingSchema.index({ createAt: -1 });

bookingSchema.virtual("documentType").get(function () {
  return "Booking";
});

// bookingSchema.pre(/^find/, function (next) {
//   this.populate({ path: "user", select: "_id name" });
//   next();
// });

// bookingSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "cart.product",
//     select: "name _id",
//     strictPopulate: false,
//   });
//   next();
// });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
