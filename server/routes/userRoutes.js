const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const { signup, signin } = require("../controllers/userController");

const prisma = new PrismaClient();
const router = express.Router();

/* ✅ AUTH */
router.post("/signup", signup);
router.post("/login", signin);


/* ✅ GET CURRENT USER (SETTINGS FETCH) */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        city: true,
        zipCode: true,
        profilePic: true,
        notifications: true,
        preferences: true
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);

  } catch (err) {
    console.error("GET /me:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});


/* ✅ UPDATE SETTINGS + PASSWORD */
router.put("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    const {
      name,
      phone,
      country,
      city,
      zipCode,
      profilePic,
      notifications,
      preferences,
      password
    } = req.body;

    const data = {
      name,
      phone,
      country,
      city,
      zipCode,
      profilePic,
      notifications,
      preferences
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data
    });

    res.json(updated);

  } catch (err) {
    console.error("PUT /me:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


/* ✅ DELETE ACCOUNT */
router.delete("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    await prisma.user.delete({ where: { id: decoded.id } });

    res.json({ message: "Account deleted" });

  } catch (err) {
    console.error("DELETE USER:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});


/* ✅ GOOGLE LOGIN */
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {

    const userData = JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic
    });

    const encoded = encodeURIComponent(userData);
    res.redirect(`http://localhost:5173/dashboard?user=${encoded}`);
  }
);


/* ✅ LOGOUT */
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

module.exports = router;