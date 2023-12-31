const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      maxlength: [
        40,
        "A name must be equal or less than 40 characters",
      ],
      minlength: [
        1,
        "A name must be equal or more than 1 character",
      ],
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      unique: true,
      validate: [validator.isEmail, "Invalid Email Type"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "A user must have a phone number"],
      validate: {
        validator: function (value) {
          return value.length === 10;
        },
        message:
          "Phone must have a length of 10 characters",
      },
    },
    identification: {
      type: String,
      required: [true, "A user must have a ID"],
      unique: true,
      validate: {
        validator: function (value) {
          return value.length === 10;
        },
        message: "ID must have a length of 10 characters",
      },
    },
    address: {
      type: String,
      required: [true, "A user must have a address"],
      minlength: [
        1,
        "A address must be equal or more than 1 character",
      ],
    },
    role: {
      type: String,
      enum: ["user", "vip", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please Enter The Password"],
      maxlength: [
        20,
        "Password Should Have Less Or Equal Than 20 Characters",
      ],
      minlength: [
        10,
        "Password Should Have More Or Equal Than 10 Characters",
      ],
      select: false,
      validate: {
        validator: function (val) {
          return validator.isStrongPassword(val, {
            returnScore: true,
          });
        },
        message:
          "Password Must Contains At Least One UpperCase",
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm The Password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password Does Not Match",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("bookings", {
  ref: "Booking",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  //Execute the function if password Schema is modified (created or updated)
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(
    candidatePassword,
    userPassword
  );
};

userSchema.methods.changePasswordAfter = function (
  JWTTimestamp
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //If changedTimestamp > JWTTimestamp returns True,
    //means password changed after the JWTTimestamp (JWT issued Time)
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
