const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const teammates = new mongoose.Schema({
  userId:{
    type : String,
    unique: true
  },
  contact: {
    type: Number,
    trim: true,
  },
  title :{
    type : String,
    trim : true 
  },
  keyPoint : [
  { 
    type : String,
    trim : true
  }
 ],
  image: String,
  tick :{
    type: String,
    default: "unverified",
    enum: ["verified","unverified"],
  },
  description : String,
  location: String,
  position : String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date}
});
teammates.index({ userId: 1 }, { unique: true });
module.exports = mongoose.model("Teammates", teammates);

