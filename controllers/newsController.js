const News = require("../models/newsModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllNews = catchAsync(async (req, res, next) => {
  const doc = await News.find()
    .sort({ newsIssueDate: -1 })
    .select(
      "-newsContent -newsContentImg -newsProductInfo"
    );
  if (!doc)
    res.status(404).json({
      status: "sucess",
      message: "No news found",
    });
  res.status(200).json({
    status: "sucess",
    results: doc.length,
    data: {
      doc,
    },
  });
});

exports.getNewsById = catchAsync(async (req, res, next) => {
  const doc = await News.findById(req.params.id);
  if (!doc)
    res.status(404).json({
      status: "sucess",
      message: "No news found with the id",
    });
  res.status(200).json({
    status: "sucess",
    data: {
      doc,
    },
  });
});
