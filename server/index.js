require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");


require("./passport");



const userRoutes = require("./routes/userRoutes.js");
const boardRoutes = require("./routes/boards.js");


const listRoutes = require("./routes/lists.js");
const cardRoutes = require("./routes/cards.js");
const commentRoutes = require("./routes/comments.js")
const labelRoutes = require("./routes/labels.js")
const activityRoutes = require("./routes/activity.js")
const cardDetailsRoutes = require("./routes/cardsDetails");
const calendarRoutes = require("./routes/calendarRoutes");





const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


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

app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);


app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/labels", labelRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/cards/details", cardDetailsRoutes);
app.use("/api/events", require("./routes/events"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/calendar", calendarRoutes);
app.use("/api/settings", require("./routes/settings"));





app.get("/", (req, res) => {
  res.send("✅ Server running and connected to MySQL");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));