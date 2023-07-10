const express = require("express");

const {
  getProductByType,
  getProductByBrand,
} = require("../controllers/productController");

const router = express.Router();

router.route("/:type").get(getProductByType);
router.route("/:type/:brand").get(getProductByBrand);

module.exports = router;
