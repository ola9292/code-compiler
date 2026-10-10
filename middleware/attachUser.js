// middleware/attachUser.js
import jwt from "jsonwebtoken";

export default function attachUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = decoded; // { userId, is_admin }
    req.user = decoded; // also handy to have on req for your route handlers/controllers
  } catch (err) {
    res.locals.user = null; // expired or tampered token — treat as logged out
  }

  next();
}
//you can then use things like user && user.is_admin in the ejs
