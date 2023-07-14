module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(
          (error) => error.message
        );
        return res.status(400).json({
          status: "error",
          message: "validation error",
          errors,
        });
      }
      if (
        err.name === "MongoServerError" ||
        err.code === 11000
      ) {
        const fieldName = Object.keys(err.keyPattern)[0];
        const fieldValue = err.keyValue[fieldName];

        return res.status(409).json({
          status: "error",
          message: "Duplicate key error",
          field: fieldName,
          value: fieldValue,
        });
      }
      next(err);
    });
  };
};
