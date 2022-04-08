let mongoose = require("mongoose");
const allTags = require("./allTags");

let courseSechema = new mongoose.Schema({
  title:{type: String, required: true},
  instructor: { type: String, require: true },
  balance: { type: mongoose.Schema.Types.Decimal128, min: 0, default: 0 },
  enrollFee:{type: mongoose.Schema.Types.Decimal128, min:0,default:0},
  numOfStudent:{type: Number, min:0,default:0},
  //Use allTags as reference  
  tags: { type: [String], default: [] },
  content:{type: String, default:""},
  open: { type: Boolean, default: true },
});

module.exports = mongoose.model("Course", courseSechema);
