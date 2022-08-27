const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const service = new mongoose.Schema({
  
  serviceName: {
    type : String,
    trim : true
  },
  subName :{
    type : String,
    trim : true 
  },
  keyPoint : [
    { 
      type : String,
      trim : true
    }
  ],
  price:  {
    type : Number,
    trim : true
  },
  description : String,
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date }
});
module.exports = mongoose.model("serviceDetail", service);

