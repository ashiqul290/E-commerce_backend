const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require('path');
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// security
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);

// routes
app.use("/api/auth", require("./routes/auth/signin"));
app.use("/api/auth", require("./routes/auth/signup"));
app.use("/api/products", require("./routes/product/productRoutes"));
app.use("/api/categories", require("./routes/category/categoryRoutes"));
app.use("/api/cart", require("./routes/cart/cartRoutes"));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));