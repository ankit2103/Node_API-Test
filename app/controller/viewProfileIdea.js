const IdeaDetails = require("../models/ideaDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;

const viewIdea = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const verify = await UserDetails.exists({ userId: userId });
          if (verify) {
            const _id = verify._id;
            const count = await IdeaDetails.countDocuments();
            // JOIN IN MONGODB
            const result = await IdeaDetails.find({ userId:_id }).sort()
             .lean().populate({
              path: "userId",
              select:
                "firstName lastName email skill -_id",
                model: UserDetails,
            })
            .exec();
            let idea = [];
            let detail = [];
            // console.log(result)
            for (let i = 0; i < result.length; i++) {
              detail = {
                ideaId: result[i].ideaId,
                userId: result[i].userId,
                ideaName: result[i].ideaName,
                tagLine: result[i].tagLine,
                tag: result[i].tag,
                image:
                  "https:docs.vourl.com/uploads/ideaImages/"+ result[i].logoImage,
                description: result[i].description,
              };
              idea.push(detail);
            }
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Successfully",
                data: idea,
              });
              // console.log(result);
            } else throw new Error("ce3");
          } else {
            res.send({
              code: 201,
              status: "fail",
              message: "Invalid User",
            });
          }
        } else {
          res.send({ code: 201, status: "fail", message: "Invalid Request" });
        }
      } else {
        res.send({
          code: 201,
          status: "invalidAuth",
          message: "Access Denied",
        });
      }
    } else throw new Error("vd2");
  } catch (er) {
    console.log(er.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = { viewIdea };
