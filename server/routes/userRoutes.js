const express = require("express");
const passport = require("passport");
const { signup, signin, updateUser, searchUsers, getAllUsers } = require("../controllers/userController.js");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/signup", signup);
router.post("/login", signin);
router.get("/search", searchUsers);
router.get("/", getAllUsers);

router.get("/me", async (req, res) => {
  try {
    if (req.user) {
      return res.json(req.user);
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

router.put("/me", async (req, res, next) => {
  // Middleware to verify token and attach user to req
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.user = { id: decoded.id }; // Minimal user object for controller
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}, updateUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "https://project-management-app-tau-six.vercel.app/login" }),
  (req, res) => {
    const userData = JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic,
    });

    const encoded = encodeURIComponent(userData);

    res.redirect(`https://project-management-app-tau-six.vercel.app/dashboard?user=${encoded}`);
  }
);

// LOGOUT
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.send({ message: "Logged out" });
  });
});

module.exports = router;
