const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const Email = require("email-templates");
const nodemailer = require("nodemailer");
dotenv.config();
const headerAuthkey = process.env.HEADER_AUTHKEY;
const msgHeaderAuthkey = process.env.MSG_HEADER;

const forgetOtp = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
    const bodyAuthkey = process.env.MSG_BODY_AUTHKEY;
      if (req.body.emailContact) {
        const { escapeHtml } = require("./functional");
        const emailcontact = escapeHtml(req.body.emailContact);
        const regExContact = /^[6-9]\d{9}$/;
        const validatecontact = regExContact.test(emailcontact);
        if (!validatecontact) {
          try {
            const user = await UserDetails.find({  
              email: emailcontact, 
              emailStatus:{
                emailVerification : "verified"
               }
              }
             );
              if(user.length != 0){
              var OTP;
              const { genOTP } = require("./functional");
              // forget
              // OTP = genOTP();
              OTP =process.env.TEST_REOTP;
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
              //   text: OTP.toString(), // Plain text body
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
                  // user.resetStatus.OTP = OTP;
                  // user.resetStatus.otpTime = Date.now();
                  const verify = await UserDetails.findOneAndUpdate(
                    { userId: user[0].userId },
                    {
                      resetStatus: {
                        OTP: OTP,
                        otpTime: Date.now(),
                      },
                    }
                  );
                  // const verify = await user.save();
                  if (verify) {
                    res.send({
                      code: 200,
                      status: "success",
                      message: "Otp Send Successfully",
                    });
                  } else {
                    res.send({
                      code: 201,
                      status: "fail",
                      message: "Something Went Wrong",
                    });
                  }
                }else{
                  res.send({
                    code: 201,
                    status: "fail",
                    message: "Email Not Exist",
                  });
                }
              // });
            // }else{
            //   res.send({
            //     code: 201,
            //     status: "fail",
            //     message: "Email Not Exist",
            //   });
            // }
          } catch (error) {
            // Honeybadger.notify(error);
            console.log(error.message);
            res.send({
              code: 201,
              status: "fail",
              message: "Something Went Wrong",
            });
          }
        } else {
          try {
            const contact = parseInt(emailcontact)
            const user = await UserDetails.find({  
              contact: emailcontact, 
              contactStatus:{
                contactVerification : "verified"
               }
              }
             );
            if(user.length !=0){
            var OTP;
            const { genOTP } = require("./functional");
            // OTP = genOTP();
            OTP =process.env.TEST_REOTP;
            const body = {
              "auth-key": bodyAuthkey,
              mobileno: contact,
              otp: OTP,
            };
            const headers = { Authkey: msgHeaderAuthkey };
            const otpUrl = process.env.OTP_URL;
            const { otpsend } = require("./functional");
            user[0].resetStatus.OTP = OTP;
            user[0].resetStatus.otpTime = Date.now();
            const result = await otpsend(otpUrl, body, headers, user);
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Otp Send Successfully",
              });
            } else {
              throw new Error("fp1");
            }
          }else{
            res.send({
              code: 201,
              status: "fail",
              message: "Contact Not Exist",
            });
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
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else {
      throw new Error("fp3");
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

module.exports = { forgetOtp };
