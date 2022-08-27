const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");

dotenv.config();

const Login = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.password && req.body.email) {
        const email = escapeHTML(req.body.email);
        const password = escapeHTML(req.body.password);
        // const loginType = escapeHTML(req.body.loginType);
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
          // if (loginType != undefined || loginType != " ") {
          //   if (loginType == "google.com" || loginType == "Linkedin.com" || loginType == "facebook.com" || loginType == 'apple.com') {
          //     if (token) {
          //       res.send({
          //         code: 200,
          //         status: "success",
          //         message: "Login Succesfully ",
          //         userId: userId,
          //         jwt: token,
          //       });
          //     } else throw new Error("l1");
          //   } else {
          //     res.send({
          //       code: 201,
          //       status: "fail",
          //       message: "Invalid Request",
          //     });
          //   }
          // } else {
            bcryptjs.compare(
              password,
              userData.password,
              function (err, result) {
                if (result) {
                  res.send({
                    code: 200,
                    status: "success",
                    message: "Login Succesfully ",
                    userId: userId,
                    jwt: token,
                  });
                } else {
                  res.send({
                    code: 201,
                    status: "fail",
                    message: "Invalid  Password",
                  });
                }
              }
            );
          // }
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "Email Not Exist",
          });
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("l2");
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
  Login,
};
