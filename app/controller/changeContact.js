const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
const msgHeaderAuthkey = process.env.MSG_HEADER;

dotenv.config();

const changeContact = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.contact && req.body.userId) {
    const bodyAuthkey = process.env.MSG_BODY_AUTHKEY;
        const contact = parseInt(escapeHtml(req.body.contact));
        const userId = parseInt(escapeHtml(req.body.userId));
        const verify = await UserDetails.findOne({ userId }).exec();
        if (verify) {
          if (verify.contactStatus.contactVerification === "verified") {
            res.send({
              code: 201,
              status: "contactexist",
              message: "Contact Already Exist",
            });
          } else {
            const regExContact = /^[6-9]\d{9}$/;
            const validatecontact = regExContact.test(contact);
            if (validatecontact) {
            const contactverify = await UserDetails.findOne({  
              contact: contact, 
              contactStatus:{
                contactVerification : "verified"
               }
              }
             );
             if (contactverify) {
                res.send({
                  code: 201,
                  status: "contactexist",
                  message: "Contact Already Exist",
                });
              } else {
                  var OTP;
                    OTP = process.env.TEST_OTP;
                    // const { genOTP } = require("./functional");
                    // ContactOTP = genOTP();
                  // const headers = { Authkey : process.env.HEADER};
                  const body = {
                    "auth-key": bodyAuthkey,
                    mobileno: contact,
                    otp: OTP,
                  };
                  const headers = { Authkey: msgHeaderAuthkey };
                  const otpUrl = process.env.OTP_URL;
                  const { otpsend } = require("./functional");
                  verify.contactStatus.OTP = OTP;
                  verify.contactStatus.otpTime = Date.now();
                  const result = await otpsend(otpUrl, body, headers, verify);
                  if(result){
                  const detail = await UserDetails.findOneAndUpdate(
                    { userId: userId },
                    {
                      contact: contact,
                      contactStatus: {
                        OTP: OTP,
                        otpTime: Date.now(),
                        contactVerification: "unverified",
                      },
                    }
                  );
                  if (detail) {
                    res.send({
                      code: 200,
                      status: "success",
                      message: "Change Successfully",
                    });
                  } else throw new Error("cc1");
                  } else throw new Error("cc2");
              }
            } else {
              res.send({
                code: 201,
                status: "fail",
                message: "Invalid contact number",
              });
            }
          } 
          } else{
          res.send({
            code:201,
            status : "fail",
            message : "Invalid  User"
          });
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("cc4");
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
  changeContact,
};
