const express = require("express");
const {
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");
const router = express.Router({ mergeParams: true });

router.route("/").get(getAllBookings).post(createBooking);
router
  .route("/:id")
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
