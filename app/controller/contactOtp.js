const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const headerAuthkey = process.env.HEADER_AUTHKEY;
const msgHeaderAuthkey = process.env.MSG_HEADER;
dotenv.config();

const mobileOtp = async (req, res) => {
  try {
    const bodyAuthkey = process.env.MSG_BODY_AUTHKEY;
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.contact && req.body.userId) {
        const { escapeHtml } = require("./functional");
        const contact = escapeHtml(req.body.contact);
        const userId = escapeHtml(req.body.userId);
        const regExContact = /^[6-9]\d{9}$/;
        const validatecontact = regExContact.test(contact);
        if (validatecontact) {
          const userverify = await UserDetails.exists({ userId });
          if (userverify) {
            const user = await UserDetails.findOne({ contact: contact });
            if (user) {
              var OTP;
              const { genOTP } = require("./functional");
                OTP =process.env.TEST_REOTP;
              // OTP = genOTP();
              const body = {
                "auth-key": bodyAuthkey,
                mobileno: contact,
                otp: OTP,
              };
              const headers = { Authkey: msgHeaderAuthkey };
              const otpUrl = process.env.OTP_URL;
              const { otpsend } = require("./functional");
              user.contactStatus.OTP = OTP;
              user.contactStatus.otpTime = Date.now();
              const result = await otpsend(otpUrl, body, headers, user);
              if (result) {
                res.send({
                  code: 200,
                  status: "success",
                  message: "Otp Send Successfully",
                });
              } else {
                throw new Error("co1");
              }
            } else {
              res.send({
                code: 201,
                status: "fail",
                message: "Contact Not Exist",
              });
            }
          } else {
            res.send({
              code: 201,
              status: "fail",
              message: "Invalid User",
            });
          }
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "Invalid Contact Number",
          });
        }
      } else {
        throw new Error("co2");
      }
    } else {
      res.send({ code: 201, status: "fail", message: "Invalid Request" });
    }
  } catch (error) {
    // Honeybadger.notify(error);
    console.log(error.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = { mobileOtp };
