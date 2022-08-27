const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const inquiry = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
   category: {
    type: String,
    trim: true,
  },
  tag : [ {
    type:String
    }
    ],
  userId :  {
      type: Number,
      ref: "userdetails",
    },
  description : String,
  createdAt : { type: Date, default: Date.now },
});
module.exports = mongoose.model("Inquiry", inquiry);
