const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const explorer = new mongoose.Schema({
  expId :{
    type : String,
    unique: true
  },
  contact: {
    type: Number,
    trim: true,
  },
  role :{
    type : String,
    trim : true 
  },
  keyPoint : [
  { 
    type : String,
    trim : true
  }],
  image: String,
  tick :{
    type: String,
    default: "unverified",
    enum: ["verified","unverified"],
  },
  description : String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  organization : String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date}
});
explorer.index({ expId: 1 }, { unique: true });
explorer.index({ location: "2dsphere" });
module.exports = mongoose.model("explorerDetail", explorer);

