const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //verify method returns decoded if succeeds; verify method verifys and decodes token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next(); //if we successfuly authenticate
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
