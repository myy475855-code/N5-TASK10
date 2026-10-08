// Demo auth adapter. Replace with the JWT/session middleware from the authentication task in production.
module.exports = function auth(req, res, next) {
  const id = Number(req.header("x-user-id"));
  const role = req.header("x-user-role");
  if (!id || !role) return res.status(401).json({ error: "Authentication required" });
  req.user = { id, role };
  next();
};