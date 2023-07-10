const mongoose = require("mongoose");

const testingSchema = new mongoose.Schema({
  man: {
    type: mongoose.Schema.ObjectId,
    ref: "Man",
    required: [true, "A testing must belong to a man"],
  },
  word: {
    type: String,
    required: [
      true,
      "A man must say something in a testing",
    ],
  },
});

const Testing = mongoose.model("Testing", testingSchema);

module.exports = Testing;
