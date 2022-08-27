const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const query = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
   message: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error({
          code: 201,
          status: "fail",
          message: "Invalid   mail address",
        });
      }
    },
  },
  dateTime: { type: Date, default: Date.now },
});
module.exports = mongoose.model("RaiseQuery", query);
