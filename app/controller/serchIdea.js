const IdeaDetails = require("../models/ideaDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;

const search = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
        if(req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp ){
        if (req.body.userId && req.body.search) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const userVerify = await UserDetails.findOne({ userId }).exec();
          if(userVerify){
          const search = escapeHtml(req.body.search);
          const result = {};
          const limit = 1;
          const page = 1;
          const totalPosts = await IdeaDetails.countDocuments().exec();
          let startIndex = page * limit;
          const endIndex = (page + 1) * limit;
          result.totalIdeas = totalPosts;
          if (startIndex > 0) {
            result.previous = {
              page: page - 1,
              limit: limit,
            };
          }
          if (endIndex < (await IdeaDetails.countDocuments().exec())) {
            result.next = {
              page : page + 1,
              limit: limit,
            };
          }
        startIndex = (page-1) * limit;
         result.data = await IdeaDetails.find(
            {
              // $and: [{ userId: userId }],
              $or: [
                { ideaName: { $regex: ".*" + search + ".*", $options: "i" } },
                { tag: { $regex: search, $options: "i" } },
                { ideaId: { $regex: ".*" + search + ".*", $options: "i" } },
              ],
            },
            { ideaId: 1, ideaName: 1, tag: 1, tagLine: 1, _id: 0 }
          
          ).sort({ _id: 1 })
           .limit(limit)
          .skip(startIndex)
          .exec();
         result.rowsPerPage = limit;
          if (result) {
            res.send({
              code: 200,
              status: "success",
              message: "Successfully",
              data: result,
            });
            // console.log(result);
          } else throw new Error("si1");
        }else {
          res.send({ code: 201, status: "fail", message: "Invalid User" });
        } 
      }else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
      } else {
        res.send({
          code: 201,
          status: "invalidAuth",
          message: "Access Denied",
        });
      }
    } else throw new Error("si3");
  } catch (er) {
    console.log(er.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = { search };
