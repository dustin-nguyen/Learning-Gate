let mongoose = require("mongoose");

let userSechema = new mongoose.Schema({
  username: { unique: true, type: String },
  password: String,
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  dob: Date,
  balance: { type: mongoose.Schema.Types.Decimal128, min: 0, default: 0 },
  isInstructor: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSechema);
