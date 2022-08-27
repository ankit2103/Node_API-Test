const ServiceDetails = require("../models/serviceDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
const msgHeaderAuthkey = process.env.MSG_HEADER;

dotenv.config();
const header = process.env.HEADER;
const services = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      // console.log(req.jwtId.userId);
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const verify = await UserDetails.exists({ userId: userId });
          const recordsLimit = 12;
          const page = parseInt(req.body.page) 
          const recordsToBeSkipped = (parseInt(req.body.page) - 1) * recordsLimit;
          if (verify) {
            const result = await ServiceDetails.find()
              .sort("_id")
              .limit(recordsLimit)
              .skip(recordsToBeSkipped)
              .lean()
              .exec();
            // console.log(result)
            const count = await ServiceDetails.find().count()
            let services = [];
            let detail = []; 
            for (let i = 0; i < result.length; i++) {
              detail = {
                serviceName: result[i].serviceName,
                subName: result[i].subName,
                keyPoint: result[i].keyPoint,
                description: result[i].description,
                price :  '$ '+result[i].price,
              };
              services.push(detail);
            }
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Successfully",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
                data: services,
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
    } else throw new Error("vE1");
  } catch (e) {
    console.log(e.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  services,
};
