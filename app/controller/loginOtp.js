const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");

dotenv.config();

const LoginOtp = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.otp && req.body.email) {
        const email = escapeHTML(req.body.email);
        const password = parseInt(escapeHTML(req.body.otp));
        let userData = await UserDetails.find({ 
          email: email, 
          emailStatus:{
            emailVerification : "verified"
           }
        });
        
        if (userData.length != 0) {
          const userId = userData[0].userId;
          const token = jwt.sign({ userId }, process.env.SECREAT_KEY, {
            expiresIn: Date.now()+86400, // expires in 24 hours
          });
          if (password === userData[0].resetStatus.OTP) {
            res.send({
              code: 200,
              status: "success",
              message: "Login Succesfully",
              userId : userId,
              jwt: token,
            });
          } else {
            res.send({
              code: 201,
              status: "fail",
              message: "Invalid otp",
            });
          }
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "Email Not Exist",
          });
        }
      }else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
      } else throw new Error("lo1");
  } catch (error) {
    console.log(error.message);
    res.send({
      code : 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  LoginOtp
};
