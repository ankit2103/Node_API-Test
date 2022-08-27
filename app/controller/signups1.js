const signup = require("../models/userDetail");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const { counter, UserDevices } = require("../models/userCounter");
const { escapeHtml } = require("./functional");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

const signups1 = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (
        req.body.firstName &&
        req.body.lastName &&
        req.body.email &&
        req.body.signupType &&
        req.body.from 
      ) {
        const { getNextSequenceValue} = require("./functional");
        const seq = await getNextSequenceValue(counter);
        const fname = escapeHtml(req.body.firstName);
        const lname = escapeHtml(req.body.lastName);
        const from = escapeHtml(req.body.from);
        const email = escapeHtml(req.body.email);
        const imageUrl = escapeHtml(req.body.imageUrl);
        const signupType = escapeHtml(req.body.signupType);
        let form = undefined

        if(signupType == 'google.com' || signupType == 'Linkedin.com' || signupType == 'facebook.com' || signupType == 'apple.com' ){
        form = new signup({
            userId: seq,
            firstName: fname,
            lastName: lname,
            from: from,
            email: email,
            imageUrl :imageUrl,
            profileComplete :5,
            signupType: signupType,
          });
        }
        else{
          form = new signup({
            userId: seq,
            firstName: fname,
            lastName: lname,
            from: from,
            email: email,
            profileComplete :5,
            signupType: signupType,
          });
        }
        // Email Exists Check 
        const userData = await signup.find({  
          email: email, 
          emailStatus:{
            emailVerification : "verified"
           }
          }
         );
        //  console.log(userData)
         if (userData.length != 0) {
            res.send({
              code: 201,
              status: "emailexist",
              message: "Email Already Exist",
            });
          } 
          else {
            // const userDevice = UserDevices({userId: seq});
            // await userDevice.save();
            if(form){
            await form
              .save()
              .then((data) => {
                res.send({
                  code: 200,
                  status: "success",
                  userId: seq,
                  message: "Successfully",
                });
              })
              .catch((err) => {
                console.log(err.message);
                res.send({
                  code: 201,
                  status: "fail",
                  message: "Something Went Wrong",
                });
              });
            }else throw new Erro("s12")
          }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("ss1");
  } catch (error) {
    console.log(error.message)
    res.send({
      code : 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  signups1
};
