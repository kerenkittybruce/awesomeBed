// Importing Authentication Middleware
require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
// Creating a token
function createToken(user) {
  return sign(
    // agree to terms and conditions
    {
      EmailAdd: user.EmailAdd,
      UserPassword: user.UserPassword,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}
//
function verifyAToken(req, res, next) {
  try {
    const token =
      req.cookies["LegitUser"] !== null
        ? req.cookies["LegitUser"]
        : "Please register to be a person";
    const isValid = null;
    if (token !== "Please register to be a person") {
      isValid = verify(token, process.env.SECRET_KEY);
      if (isValid) {
        req.authenticated = true;
        next();
      } else {
        res.status(400).json({ err: "Please register to be a person" });
      }
    } else {
      res.status(400).json({ err: "Please register to be a person" });
    }
  } catch (e) {
    res.status(400).json({ err: e.message });
  }
}
module.exports = { createToken, verifyAToken };
