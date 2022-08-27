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
          const recordsLimit = 12;
          const page = parseInt(req.body.page);
          const recordsToBeSkipped =
            (parseInt(req.body.page) - 1) * recordsLimit;
          if (verify) {
            const count = await IdeaDetails.countDocuments();
            // JOIN IN MONGODB
            const result = await IdeaDetails.find()
              .sort("ideaId")
              .limit(recordsLimit)
              .skip(recordsToBeSkipped)
              .exec();
            let idea = [];
            let detail = [];
            // console.log(result)
            for (let i = 0; i < result.length; i++) {
              let result1, ser;
              let image = [];
              //  console.log(result[i].viewUserId)
              for (let j = 0; j < result[i].viewUserId.length; j++) {
                ser = result[i].viewUserId[j];
                result1 = await UserDetails.findOne({ userId: ser });
                // console.log(result1)
                if (result1.imageUrl == undefined || result1.imageUrl == "") {
                  if (
                    result1.profileImage == undefined ||
                    result1.profileImage == ""
                  ) {
                    image[j] =
                      "https:docs.vourl.com/uploads/defaultProfileImages/Def_1000_profile.jpeg";
                  } else {
                    image[j] =
                      "https:docs.vourl.com/uploads/profileImages/" +
                      result1.profileImage;
                  }
                } else {
                  image[j] = result1[i].imageUrl;
                }
              }
              detail = {
                ideaId: result[i].ideaId,
                userId: result[i].userId,
                title: result[i].ideaName,
                tagLine: result[i].tagLine,
                tag: result[i].tag,
                viewImage: image,
                image:
                  "https:docs.vourl.com/uploads/ideaImages/" +
                  result[i].logoImage,
                description: result[i].description,
              };
              idea.push(detail);
            }
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Successfully",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
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
