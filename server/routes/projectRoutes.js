const express = require("express");
const router = express.Router();
const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();

// Get all projects
router.get("/", async (req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

// Create a new project
router.post("/", async (req, res) => {
  const { title, description, ownerId } = req.body;
  const project = await prisma.project.create({
    data: { title, description, ownerId },
  });
  res.json(project);
});

module.exports = router;

