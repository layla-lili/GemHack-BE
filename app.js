const adminBroRoute = require("./routes/adminBro");

const express = require("express");
const passport = require("passport");
const db = require("./db/models");

// const productRoutes = require("./routes/products");
// const shopRoutes = require("./routes/shops");
// const userRoutes = require("./routes/users");
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const cors = require("cors");
const app = express();
const path = require("path");
//////////////////
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const User = require("./db/models/user");
const routes = require("./routes/route");

require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});
///////////////////////
// Middleware
app.use(express.json());
app.use(cors());

// Passport
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// Routes
// app.use("/products", productRoutes);
// app.use("/shops", shopRoutes);
// app.use(userRoutes);
//////////////////////
app.use("/admin", adminBroRoute);
app.use("/", routes);
/////////////////////
app.use("/media", express.static(path.join(__dirname, "media")));

///////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    const { userId, exp } = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: "JWT token has expired, please login to obtain a new one",
      });
    }
    res.locals.loggedInUser = await User.findById(userId);
    next();
  } else {
    next();
  }
});
//////////////////////////

app.use((req, res, next) => {
  const error = new Error("Path Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message || "Internal Server Error" });
});

/////////////
//const PORT = process.env.PORT || 8001;
///////////////

const PORT = 8001;
db.sequelize.sync({ alter: true });
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
