const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const globalErrorHandler = require("./controllers/errorController");
const productRouter = require("./routes/productRoutes");
const authRouter = require("./routes/authRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const newsRouter = require("./routes/newsRoutes");

const corsOptions = {
  origin: "https://chic-bavarois-3ca720.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// app.use(cors());
// app.options("*", cors());

app.use(helmet());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://chic-bavarois-3ca720.netlify.app"
  );
  next();
});

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  //Time window(mil-secs)
  message:
    "Too Many Request From This IP, Please Try Later",
});
// app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({ extended: true, limit: "10kb" })
);
app.use(cookieParser({ secure: false }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.get("/", (req, res) => {
  res.status(200).send("Hello From The Server Side");
  // res.status(200).json({
  //   message: "Hello from the server side!",
  //   app: "Natours",
  // });
});

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", authRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/news", newsRouter);

// app.use(globalErrorHandler);
module.exports = app;
