const { PrismaClient } = require("@prisma/client")
const bcrypt = ("bcryptjs")
const jwt = ("jsonwebtoken")

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Signup
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Signup successful", token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Signin
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signup, signin }