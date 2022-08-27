const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");

const Signup = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
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
          message: "Invalid  mail address",
        });
      }
    },
  },
  profileImage: String,
  coverImage: String,
  description: String,
  idea: [
    {
      type: String,
    },
  ],

  skill: [
    {
      type: String,
    },
  ],

  emailStatus: {
    emailVerification: {
      type: String,
      default: "unverified",
      enum: ["verified", "unverified"],
    },
    OTP: {
      type: Number,
    },
    otpTime: {
      type: Number,
    },
  },
  contactStatus: {
    contactVerification: {
      type: String,
      default: "unverified",
      enum: ["verified", "unverified"],
    },
    OTP: {
      type: Number,
    },
    otpTime: {
      type: Number,
    },
  },
  from: {
    type: String,
    trim: true,
  },
  contact: {
    type: Number,
    trim: true,
  },
  defines: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  cityDistrict: {
    type: String,
    trim: true,
  },
  signupType: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  resetStatus: {
    OTP: {
      type: Number,
    },
    otpTime: {
      type: Number,
    },
  },
  profileComplete : {
    type : Number,
    default : 0,
  },
  verified : {
    type : String,
    default : "No",
    enum : ["Yes","No"],
  },
  notification : {
    type : Number,
    trim: true,
    default : 0,
  },
  education : [
    {
      _id:false,
      school: { type: String },
      study: { type: String },
      degree: { type: String },
      grade: { type: String },
      activities: { type: String },
      startDate: { type: String },
      endDate: { type: String },
    },
  ],
  imageUrl : String,
  experience: [
    {
      _id:false,
      title : { type: String },
      employmentType: { type: String },
      companyName: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      location: { type: String },
      working : { 
      type: String,
      default: "No",
      enum: ["Yes", "No"],
      },
      description: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});
Signup.index({ userId: 1 }, { unique: true });
module.exports = mongoose.model("userDetail", Signup);
