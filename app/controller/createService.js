const ServiceDetails = require("../models/serviceDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const service = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      // console.log(req.jwtId.userId);
      // if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (
          req.body.name &&
          req.body.title &&
          Array.isArray(req.body.tags) &&
          req.body.description &&
          req.body.price
        ) {
          const name = escapeHtml(req.body.name);
          const title = escapeHtml(req.body.title);
          const description = escapeHtml(req.body.description);
          const tags = escapeHtml(req.body.tags).split(",");
          const price = parseInt(escapeHtml(req.body.price));
          let tagsName = [];
            for (let i = 0; i < tags.length; i++) {
              tagsName.push(tags[i]);
            }
           const serve = new ServiceDetails({
            keyPoint : tagsName,
            serviceName : name,
            subName : title,
            price : price,
            description : description
           });
            const verify = await serve.save();
               if(verify){
                    res.send({
                      code: 200,
                      status: "success",
                      message: "Create Service Successfully",
                    });
                } else throw new Error("cs1");
          } else throw new Error("cs2");
        } else {
          res.send({ code: 201, status: "fail", message: "Invalid Request" });
        }
      // } else {
      //   res.send({
      //     code: 201,
      //     status: "invalidAuth",
      //     message: "Access Denied",
      //   });
      // }
  } catch (e) {
    console.log(e.message);
    res.send({
      code: 201,
      status: "fail",
      message: "something went wrong",
    });
  }
};

module.exports = {
  service,
};
