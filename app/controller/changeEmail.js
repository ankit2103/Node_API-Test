const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const nodemailer = require("nodemailer");

const { escapeHtml } = require("./functional");
dotenv.config();

const changeEmail = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.email && req.body.userId) {
        const email = escapeHtml(req.body.email);
        const userId = parseInt(escapeHtml(req.body.userId));
        const verify = await UserDetails.findOne({ userId }).exec();
        if (verify) {
          var OTP;
          //Email verfication check
          if (verify.emailStatus.emailVerification === "verified") {
            res.send({
              code: 201,
              status: "emailexist",
              message: "Email Already Exist",
            });
          } else {
            const emailverify = await UserDetails.find({  
              email: email, 
              emailStatus:{
                emailVerification : "verified"
               }
              }
             );
            if (emailverify.length != 0) {
                res.send({
                  code: 201,
                  status: "emailexist",
                  message: "Email Already Exist",
                });
              } else {
                // if (email == process.env.TEST_NUMBER) {
                  EmailOTP = process.env.TEST_OTP;
                // } else {
                //   const { genOTP } = require("./functional");
                //   EmailOTP = genOTP();
                //   // console.log(EmailOTP);
                // } // let transport = nodemailer.createTransport({
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
                const detail = await UserDetails.findOneAndUpdate(
                  { userId: userId },
                  {
                    email: email,
                    emailStatus: {
                      OTP: EmailOTP,
                      otpTime: Date.now(),
                      emailVerification: "unverified",
                    },
                  }
                );
                if (detail) {
                  res.send({
                    code: 200,
                    status: "success",
                    message: "Change Successfully",
                  });
                } else throw new Error("ce1");
              // }
              // });
              }
            }
          } else {
          res.send({
            code :201,
            status: "fail",
            message: "Invalid  User",
          });
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("ce4");
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
  changeEmail,
};
