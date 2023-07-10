const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  newsBannerImg: {
    type: String,
    required: [true, "A news must have a banner image"],
  },
  newsTitle: {
    type: String,
    required: [true, "A news must have a title"],
  },
  newsSummary: {
    type: String,
    required: [true, "A news must have a summary"],
  },
  newsCategory: {
    type: String,
    required: [true, "A news must have a category"],
    enum: ["租借新品", "店家公告", "優惠資訊"],
  },
  newsQueryCategory: {
    type: String,
    required: [true, "A news must have a query category"],
    enum: [
      "product_info",
      "sales_activity",
      "store_announcement",
    ],
  },
  newsIssueDate: {
    type: Date,
    default: Date.now(),
  },
  newsContent: [
    {
      type: String,
    },
  ],
  newsContentImg: [
    {
      type: String,
    },
  ],
  newsProductInfo: {
    documentType: {
      type: String,
    },
    productBrand: {
      type: String,
    },
    productModel: {
      type: String,
    },
  },
});

newsSchema.index({ newsIssueDate: -1 });

const News = mongoose.model("News", newsSchema);

module.exports = News;
