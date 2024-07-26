const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
