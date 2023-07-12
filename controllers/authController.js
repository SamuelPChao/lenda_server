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
    //set secure to true so cookie will be sent on a encrypted connection (HTTPS)
    httpOnly: true,
    //set httpOnly to true so cookie cannot be accessed or modified in any way by the browser
    sameSite: "none",
  };
  // if (process.env.NODE_ENV === "production")
  //   cookieOptions.secure = true;

  res.set("Authorization",token)
  res.cookie("jwt", token, cookieOptions);

  //remove password from outputing
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
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  //   passwordChangedAt: req.body.passwordChangedAt,
  //   // passwordChangedAt: Date.now(),
  //   role: req.body.role,
  // });
  const newUser = await User.create(req.body);

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // console.log(url);
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next(
//       new AppError(
//         "Please provide valid email and password",
//         400
//       )
//     );
//   }

//   const user = await User.findOne({
//     email: email,
//   }).select("+password");
//   if (
//     !user ||
//     !(await user.correctPassword(password, user.password))
//   ) {
//     return next(
//       new AppError("Invalid email or password", 401)
//     );
//   }

//   createSendToken(user, 200, req, res);
// });
exports.login = catchAsync(async (req, res, next) => {
  const { identification, password } = req.body;
  if (!identification || !password) {
    return next(
      new AppError(
        "Please provide valid phone number and password",
        400
      )
    );
  }

  const user = await User.findOne({
    identification: identification,
  }).select("+password");
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(
      new AppError("Invalid phone or password", 401)
    );
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    secure:true,
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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Check And Get Token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    //Protect From Access The Route Without Token
    return next(new AppError("Not authorized", 401));

  //Verify Token
  //jwt.verify is an asynchronous function with callback function as third argument
  //Promisify the function in case of blocking the code from executing
  //And Call the function with the (argument1, argument2)
  const decoded = await promisify(verify)(
    token,
    process.env.JWT_SECRET
  );

  //Protect From Token Issued Before User Deleted Or No Longer Exists
  const currentUser = await User.findById(decoded.id);
  // console.log(decoded);
  if (!currentUser) {
    return next(
      new AppError(
        "User belonging to the token no longer exist",
        401
      )
    );
  }

  //Protect From Using Token Issued Before Password Changed
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password", 401)
    );
  }

  //Assign The User Found In DB With The Token To The Request For Later Use
  req.user = currentUser;
  res.locals.user = currentUser;
  //Grant Access To Protected Route => next()
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try {
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
          status: "Not authorized",
          data: {},
        });
      }
      if (currentUser.changePasswordAfter(decoded.iat)) {
        res.status(401).json({
          status: "Password Changed",
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
    next()
  } catch (err) {
    console.log(err);
  }
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
  if (!doc)
    return next(
      new AppError("No User found with the id", 404)
    );
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
  if (!doc)
    return next(
      new AppError("No user found with the id", 404)
    );
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const doc = await User.find();
  if (!doc) return next(new AppError("No user found", 404));
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
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError("Cannot Update Password Here"),
      400
    );

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
      return next(
        new AppError("Current Password Is Wrong", 401)
      );
    }

    const { password, passwordConfirm } = req.body;
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createSendToken(user, 200, req, res);
  }
);

exports.forgotPassword = catchAsync(
  async (req, res, next) => {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return next(
        new AppError("No user found with the email", 404)
      );

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });

      return next(
        new AppError("Error occurs when sending email", 500)
      );
    }
  }
);
