const jwt = require("jsonwebtoken");

const requireAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  return jwt.verify(token, "my secret key", (error, user) => {
    if (error) return res.sendStatus(403);
    if (!user.isAdmin) return res.sendStatus(403);

    req.user = user;

    return next();
  });
};

module.exports = requireAdminMiddleware;
