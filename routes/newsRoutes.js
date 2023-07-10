const express = require("express");
const {
  getAllNews,
  getNewsById,
} = require("../controllers/newsController");

const router = express.Router();

router.route("/").get(getAllNews);
router.route("/:id").get(getNewsById);

module.exports = router;
