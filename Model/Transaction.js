let mongoose = require("mongoose");


let transactionSechema = new mongoose.Schema({
  from_id:{type: mongoose.Schema.Types.ObjectId, required: true},
  to_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  from_collection: { type: String, min: 0, default: 0 },
  to_collection:{type: String, min:0,default:0},
  amount:{type: mongoose.Schema.Types.Decimal128, min:0,default:0},
  time:{type: Date, default:Date.now},
  
});

module.exports = mongoose.model("Transaction", transactionSechema);
