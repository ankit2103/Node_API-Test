const UserDetails = require("../models/userDetail");
const { escapeHtml } = require("./functional");
const dotenv = require("dotenv").config();
const header = process.env.HEADER;

const education = async (req, res) => {
  try {
    if (req.get("Authkey") == header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId && req.body.education) {
          // console.log(escapeHtml(req.body.education[0].school))

          const userId = parseInt(escapeHtml(req.body.userId));
          const educationList  = escapeHtml(req.body.education);
          const length = req.body.education.length;
          // console.log(length)
          var education1 = [];
          let data = [];
          const user = await UserDetails.findOne({ userId: userId }).exec();
          if (user) {
              for(let i=0; i < length; i++){
              education1 = {
                  school : escapeHtml(req.body.education[i].school),
                  study : escapeHtml(req.body.education[i].study),
                  degree : escapeHtml(req.body.education[i].degree),
                  activities : escapeHtml(req.body.education[i].activities),
                  grade : escapeHtml(req.body.education[i].grade),
                  startDate : escapeHtml(req.body.education[i].startDate),
                  endDate : escapeHtml(req.body.education[i].endDate)
                };
                data.push(education1)
              }
            //  console.log(data);
           profileComplete = user.profileComplete + 15;
           const insert = await UserDetails.findOneAndUpdate({userId:userId},{
              education : data,
              profileComplete : profileComplete
            })
            if(insert) {
              res.send({
                code: 200,
                status: "success",
                message: "Education Update",
              });
            }else throw new Error("ue1");
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
            message: "Invalid Request",
          });
        }
      } else {
        res.send({
          code: 201,
          status: "invalidAuth",
          message: "Access Denied",
        });
      }
    } else throw new Error("ud1");
  } catch (er) {
    console.log(er.message);
    res.send({
        code : 201,
        status : "fail",
        message : "Something Went Wrong"
    })
  }
};

module.exports = {
  education,
};
