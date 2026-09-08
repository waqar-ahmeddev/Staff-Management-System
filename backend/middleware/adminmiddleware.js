const adminMiddleware = (req, res, next) => {
  // Check if logged-in user is admin
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin only.",
  });
};

export default adminMiddleware;