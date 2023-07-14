const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  // console.log(token);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN *
          24 *
          60 *
          60 *
          1000
    ),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  };
  // if (process.env.NODE_ENV === "production")
  //   cookieOptions.secure = true;

  res.set("Authorization", token);
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // console.log(url);
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { identification, password } = req.body;
  if (!identification || !password) {
    return res.status(400).json({
      status: "error",
      message: "please provide valid identification",
    });
  }

  const user = await User.findOne({
    identification: identification,
  }).select("+password");
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return res.status(401).json({
      status: "error",
      message: "invalid password",
    });
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    secure: true,
    httpOnly: true,
  };
  req.user = undefined;
  res.locals.user = undefined;
  res.cookie("jwt", "", cookieOptions);
  res.status(200).json({
    status: "success",
    // currentUser: req.user,
    // currentUser2: res.locals.user,
  });
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // try {
  // if (req.cookies.jwt) {
  //   console.log(req.cookies.jwt,'cookie')
  //   const decoded = await promisify(verify)(
  //     req.cookies.jwt,
  //     process.env.JWT_SECRET
  //   );

  //   const currentUser = await User.findById(decoded.id);
  //   if (!currentUser) {
  //     res.status(401).json({
  //       status: "Not authorized",
  //       data: {},
  //     });
  //   }

  //   if (currentUser.changePasswordAfter(decoded.iat)) {
  //     res.status(401).json({
  //       status: "Password changed",
  //       data: {},
  //     });
  //   }

  //   res.locals.user = currentUser;
  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       user: currentUser,
  //     },
  //   });
  // }
  if (req.headers.authorization) {
    const decoded = await promisify(verify)(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: "error",
        message: "not authorized",
        data: {},
      });
    }
    if (currentUser.changePasswordAfter(decoded.iat)) {
      res.status(401).json({
        status: "error",
        message: "password Changed",
        data: {},
      });
    }
    res.locals.user = currentUser;
    res.status(200).json({
      status: "success",
      data: {
        user: currentUser,
      },
    });
  }
  next();
  // } catch (err) {
  //   console.log(err);
  // }
});

//user

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(
      new AppError("File Accepts Image Only", 400),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(
  async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${
      req.user.id
    }-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  }
);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.user.id).populate({
    path: "bookings",
    select: "_id totalPrice checked paid canceled",
  });
  if (!doc) {
    return res.status(404).json({
      status: "error",
      message: "no user found with the id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const doc = await User.findById(req.params.id).populate({
    path: "bookings",
    select: "_id totalPrice checked paid canceled",
  });
  if (!doc) {
    return res.status(404).json({
      status: "error",
      message: "no user found with the id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const doc = await User.find();
  if (!doc) {
    return res.status(404).json({
      status: "error",
      message: "no user found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      status: "error",
      message: "Cannot Update Password Here",
    });
  }
  const filterBody = filterObj(
    req.body,
    "email",
    "phone",
    "address"
  );
  if (req.file) filterBody.photo = req.file.filename;

  // const updatedUser = await User.findByIdAndUpdate(
  //   req.user.id,
  //   filterBody,
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );
  const updatedUser = await User.findByIdAndUpdate(
    req.body.id,
    filterBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "Success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updatePassword = catchAsync(
  async (req, res, next) => {
    // const user = await User.findById(req.user.id).select(
    //   "+password"
    // );
    console.log(req.body);
    const user = await User.findById(req.body.id).select(
      "+password"
    );
    console.log(user);
    if (
      !(await user.correctPassword(
        req.body.passwordCurrent,
        user.password
      ))
    ) {
      return res.status(401).json({
        status: "error",
        message: "current password is wrong",
      });
    }
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createSendToken(user, 200, req, res);
  }
);

// exports.forgotPassword = catchAsync(
//   async (req, res, next) => {
//     const user = await User.findOne({
//       email: req.body.email,
//     });
//     if (!user)
//       return next(
//         new AppError("No user found with the email", 404)
//       );

//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     try {
//     } catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });

//       res.status(200).json({
//         status: "success",
//         message: "Token sent to email",
//       });

//       return next(
//         new AppError("Error occurs when sending email", 500)
//       );
//     }
//   }
// );
