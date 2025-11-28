require("dotenv").config();
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const passport = require("passport")
const session = require("express-session")
require("./passport");

const userRoutes = require("./routes/userRoutes.js")
const boardRoutes = require("./routes/boards.js");




const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Session for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);


app.get("/", (req, res) => {
  res.send("✅ Server running and connected to MySQL");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

