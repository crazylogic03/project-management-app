const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* ✅ SIGNUP */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "supersecretkey", {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};



/* ✅ LOGIN */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "supersecretkey", {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};



/* ✅ UPDATE USER (SETTINGS SAVE & PASSWORD CHANGE) */
exports.updateUser = async (req, res) => {
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
      const hash = await bcrypt.hash(password, 10);
      data.password = hash;
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data
    });

    res.json(updatedUser);

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};