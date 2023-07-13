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
      next(err);
    });
  };
};
