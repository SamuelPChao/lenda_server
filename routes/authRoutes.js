const express = require("express");

const {
  signup,
  login,
  logout,
  protect,
  isLoggedIn,
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
  getUser,
  updateMe,
  updatePassword,
  getAllUsers,
  getUserById,
} = require("../controllers/authController");
const bookingRouter = require("./bookingRoutes");

const router = express.Router();

router.use("/:userId/bookings", bookingRouter);

router.post("/signup", signup);
router.post("/login", login);
// router.get("/logout", protect, logout);
router.get("/logout", logout);
router.post("/isLoggedIn", isLoggedIn);
router.route("/").get(getAllUsers);

// router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.get("/me", getMe, getUser);
router.patch(
  "/updateMe",
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe
);
router.get("/:id", getUserById);

module.exports = router;
