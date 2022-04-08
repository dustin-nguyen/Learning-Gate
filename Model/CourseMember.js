let mongoose = require("mongoose");

let courseMemberSchema = new mongoose.Schema({
  courseID: { unique: true, type: String },
  username: { type: String },
  isInstructor: { type: Boolean, default: false },
});

module.exports = mongoose.model("CourseMember", courseMemberSchema);
