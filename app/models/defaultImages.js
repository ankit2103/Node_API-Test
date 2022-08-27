const express = require("express");
const mongoose = require("mongoose");

const define = new mongoose.Schema({
    d_Id :{
        type :String,
        unique :true
    },
    profileImage: String,
    coverImage: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  });

module.exports = mongoose.model("defaultImage", define);
