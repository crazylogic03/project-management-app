const express = require("express");
const router = express.Router();
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();

// Get all users
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create a new user
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.create({
    data: { name, email, password },
  });
  res.json(user);
});

module.exports = router;

