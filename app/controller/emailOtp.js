const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const Email = require("email-templates");
const nodemailer = require("nodemailer");
dotenv.config();
// const headerAuthkey = process.env.HEADER_AUTHKEY;
// const msgHeaderAuthkey = process.env.MSG_HEADER;

const emailOtp = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.email && req.body.userId) {
        const { escapeHtml } = require("./functional");
        const email = escapeHtml(req.body.email);
        const userId = escapeHtml(req.body.userId);
        const userverify = await UserDetails.exists({ userId });
        if (userverify) {
          const user = await UserDetails.findOne({ email: email });
          if (user) {
            var OTP;
            const { genOTP } = require("./functional");
            // EmailOTP = genOTP();
              OTP =process.env.TEST_REOTP;
            // OTP = genOTP();
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
                user.emailStatus.OTP = OTP;
                user.emailStatus.otpTime = Date.now();
                const verify = await user.save();
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
            //   }
            // });
          } else {
            res.send({
              code: 201,
              status: "fail",
              message: "Email Not Exist",
            });
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
    } else {
      throw new Error("eo2");
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

module.exports = { emailOtp };
