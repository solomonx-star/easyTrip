import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Remove "Bearer " from the header to get the token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
