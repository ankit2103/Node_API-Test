const UserDetails = require("../models/userDetail");
const { escapeHtml } = require("./functional");
const dotenv = require("dotenv").config();
const header = process.env.HEADER;

const skill = async (req, res) => {
  try {
    if (req.get("Authkey") == header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId && Array.isArray(req.body.skill)) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const skill = escapeHtml(req.body.skill).split(',');
          const skillList = [];
          const user = await UserDetails.findOne({ userId: userId }).exec();
          if (user) {
            for(let i=0; i <skill.length; i++){
              skillList.push(skill[i]);
            }
            console.log(skillList);
            user.skill = skillList;
            user.profileComplete = user.profileComplete + 15;
            await user
              .save()
              .then((d) => {
                res.send({
                  code: 200,
                  status: "success",
                  message: "Skills Update",
                });
              })
              .catch((e) => {
                res.send({
                  code: 201,
                  status: "fail",
                  message: "something went wrong",
                });
              });
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
  skill,
};
