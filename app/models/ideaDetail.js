const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Idea = new mongoose.Schema({
  ideaName :{
    type : String,
    trim : true 
  },
  tagLine : {
    type : String,
    trim : true
  },
  logoImage : String,
  tag : [ {
  type:String
  }
  ],
  viewUserId : [
    {  type: Number,
      trim : true
    }
  ],
  description : String,
  userId :  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetail",
    },
  ideaId :{
    type : String,
    unique: true
  }
});
Idea.index({ ideaId: 1 }, { unique: true });
module.exports = mongoose.model("IdeaDetail", Idea);

