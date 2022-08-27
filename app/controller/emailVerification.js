const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");

dotenv.config();

const verification = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.email) {
        const email = escapeHTML(req.body.email);
        let userData = await UserDetails.findOne({
          email: email,
          emailStatus: {
            emailVerification: "verified",
          },
        });
        if (userData) {
          //Email Verified or not
          let userId = userData.userId;
          let token = jwt.sign({ userId }, process.env.SECREAT_KEY, {
            expiresIn: Date.now() + 86400, // expires in 24 hours
          });

          res.send({
            code: 200,
            status: "verified",
            userId : userId,
            jwt :  token,
            message: "Email is Verified",
          });
        }else {
            res.send({
              code: 201,
              status: "unverified",
              message: "Email Not Exist",
            });
          }
        }
        else {
            res.send({ code: 201, status: "fail", message: "Invalid Request" });
          }
      } else throw new Error("eV1")
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  verification,
};
