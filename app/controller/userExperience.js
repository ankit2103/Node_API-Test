const UserDetails = require("../models/userDetail");
const { escapeHtml } = require("./functional");
const dotenv = require("dotenv").config();
const header = process.env.HEADER;

const experience = async (req, res) => {
  try {
    if (req.get("Authkey") == header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId && req.body.experience) {
          // console.log(escapeHtml(req.body.experience[0].school))
          const userId = parseInt(escapeHtml(req.body.userId));
          const experienceList  = escapeHtml(req.body.experience);
          const length = req.body.experience.length;
          // console.log(length)
          var experience1 = [];
          let data = [];
          const user = await UserDetails.findOne({ userId: userId }).exec();
          if (user) {
              for(let i=0; i < length; i++){
              experience1 = {
                  title : escapeHtml(req.body.experience[i].title),
                  employmentType : escapeHtml(req.body.experience[i].employmentType),
                  companyName : escapeHtml(req.body.experience[i].companyName),
                  location : escapeHtml(req.body.experience[i].location),
                  working : escapeHtml(req.body.experience[i].working),
                  description : escapeHtml(req.body.experience[i].description),
                  startDate : escapeHtml(req.body.experience[i].startDate),
                  endDate : escapeHtml(req.body.experience[i].endDate),
                };
                data.push(experience1)
              }
            //  console.log(data);
           profileComplete = user.profileComplete + 20;
           const insert = await UserDetails.findOneAndUpdate({userId:userId},{
              experience : data,
              profileComplete :profileComplete
            })
            if(insert) {
              res.send({
                code: 200,
                status: "success",
                message: "experience Update",
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
  experience,
};
