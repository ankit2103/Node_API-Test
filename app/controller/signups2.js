const UserDetails = require("../models/userDetail");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const { escapeHtml } = require("./functional");
const nodemailer = require("nodemailer");
const headerAuthkey = process.env.HEADER_AUTHKEY;
const msgHeaderAuthkey = process.env.MSG_HEADER;

require("dotenv").config();
const signups2 = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (
        req.body.userId &&
        req.body.defines &&
        req.body.contact &&
        req.body.country &&
        req.body.state &&
        req.body.cityDistrict
      ) {
        const bodyAuthkey = process.env.MSG_BODY_AUTHKEY;
        const userId = parseInt(escapeHtml(req.body.userId));
        const defines = escapeHtml(req.body.defines);
        const contact = parseInt(escapeHtml(req.body.contact));
        const country = escapeHtml(req.body.country);
        const state = escapeHtml(req.body.state);
        const cityDistrict = escapeHtml(req.body.cityDistrict);
        const user = await UserDetails.findOne({ userId });
        if (user) {
          //Email verfication check
          if (user.emailStatus.emailVerification === "verified") {
            res.send({
              code: 201,
              status: "emailexist",
              message: "Email Already Exist",
            });
           } else {
            const regExContact = /^[6-9]\d{9}$/;
            const validatecontact = regExContact.test(contact);
            if (validatecontact) {
              //OTP GENRATER
              var OTP;
              var EmailOTP;
              var ContactOTP;
              const { genOTP } = require("./functional");
              ContactOTP = process.env.TEST_OTP;
              EmailOTP = process.env.TEST_OTP;
              // EmailOTP = genOTP();
              // ContactOTP = genOTP();
              // console.log(EmailOTP,ContactOTP);
              //Contact Verification Check
              const userData = await UserDetails.find({
                contact: contact,
                contactStatus: {
                  contactVerification: "verified",
                },
              });
              if (userData.length != 0) {
                //Contact verfication check If already contact Exist
                res.send({
                  code: 201,
                  status: "contactexist",
                  message: "Contact Already Exist",
                });
              } else {
                try {
                  const body = {
                    "auth-key": bodyAuthkey,
                    mobileno: contact,
                    otp: ContactOTP,
                  };
                  const headers = { Authkey: msgHeaderAuthkey };
                  const otpUrl = process.env.OTP_URL;
                  const { otpsend } = require("./functional"); 
                  user.contactStatus.OTP = ContactOTP;
                  user.contactStatus.otpTime = Date.now();
                  // console.log(user);
                  const result = await otpsend(otpUrl, body, headers, user);
                  if (result) {
                    //NODE MAILER FOR MAIL TRAP
                    // let transport = nodemailer.createTransport({
                    //   host: "smtp.mailtrap.io",
                    //   port: 2525,
                    //   auth: {
                    //     user: process.env.MAIL_USERNAME,
                    //     pass: process.env.MAIL_PASSWORD,
                    //   },
                    // });
                    // const message = {
                    //   from: "ben@info.in", // Sender address
                    //   to: "Y0GESH@wappgo.com", // List of recipients
                    //   subject: "********Node JS API | TESTING *****", // Subject line
                    //   text: EmailOTP.toString(), // Plain text body
                    // };
                    // transport.sendMail(message, async function (err, info) {
                    //   if (err) {
                    //     // console.log(err.message);
                    //     res.send({
                    //       code: 201,
                    //       status: "fail",
                    //       message: "Something Went Wrong",
                    //     });
                    //   } else {
                    // console.log(info);
                    const verify = await UserDetails.findOneAndUpdate(
                      { userId },
                      {
                        defines: defines,
                        contact: contact,
                        country: country,
                        state: state,
                        cityDistrict: cityDistrict,
                        profileComplete :10,
                        emailStatus: {
                          OTP: EmailOTP,
                          otpTime: Date.now(),
                          emailVerification: "unverified",
                        },
                        updatedAt: Date.now(),
                      },
                      { new: true }
                    ).exec();
                    if (verify) {
                      res.send({
                        code: 200,
                        status: "success",
                        message: "Otp Send",
                      });
                    } else {
                      res.send({
                        code: 201,
                        status: "fail",
                        message: "Something Went Wrong",
                      });
                    }
                    // }
                    // });
                  } else throw new Error("ss1");
                } catch (e) {
                  console.log(e.message);
                  res.send({
                    code: 201,
                    status: "fail",
                    message: "Something Went Wrong",
                  });
                }
              }
            } else {
              res.send({
                code: 201,
                status: "fail",
                message: "Invalid contact number",
              });
            }
          }
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "Invalid  User",
          });
        }
      }else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("ss5");
  } catch (e) {
    console.log(e.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};
module.exports = {
  signups2,
};
