const jwt = require('jsonwebtoken');
const adminModel = require("../model/admin.model");


async function authMiddleware(req, res, next) {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) 
    {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await adminModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;