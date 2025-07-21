const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized access" });
  }
  try {
    const openToken = jwt.verify(token, process.env.SECRET);
    req.user = openToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token", error });
  }
};
