const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();

const verifyOTP = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.emailOtp && req.body.contactOtp && req.body.userId) {
        const emailotp = escapeHtml(req.body.emailOtp);
        const contactotp = parseInt(escapeHtml(req.body.contactOtp));
        const userId = escapeHtml(req.body.userId);
        const verify = await UserDetails.findOne({ userId });
       
        //Email verfication check
        if (verify) {
          if (verify.emailStatus.emailVerification === "verified") {     
            res.send({
              code: 201,
              status: "emailexist",
              message: "Email Already Exist",
            });
          } else if (verify.contactStatus.contactVerification === "verified") {
            res.send({
              code: 201,
              status: "contactexist",
              message: "Contact Already Exist",
            });
          } else {
              const { checkOTP } = require("./functional");
              const result = await checkOTP(
                UserDetails,
                userId,
                emailotp,
                contactotp
              );
              if (result.status) {
                res.send({
                  code: 200,
                  status: "success",
                  message: result.message,
                  existingUser: result.existingUser,
                  userid: result.userId.toString(),
                });
              } else {
                res.send({
                  code: 201,
                  status: "fail",
                  message: result.message,
                });
              }
          }
        } else {
          res.send({
            code : 201,
            status: "fail",
            message: "Invalid User",
          });
        }
      }else {
        res.send({ code: 201, status : "fail", message: "Invalid Request" });
      }
    } else throw Error("vo3");
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
  verifyOTP,
};
