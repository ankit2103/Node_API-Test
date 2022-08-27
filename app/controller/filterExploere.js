const ExploereDetails = require("../models/explorerDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const msgHeaderAuthkey = process.env.MSG_HEADER;

const filterExploere = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      // console.log(req.jwtId.exp);
      // console.log(Date.now());
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const role = escapeHtml(req.body.role);
          const industry = escapeHtml(req.body.industry);
          const recordsLimit = 12;
          const page = parseInt(req.body.page)
          const recordsToBeSkipped = (parseInt(req.body.page) - 1) * recordsLimit;
          const verify = await UserDetails.exists({ userId: userId });
          let count = 0
          let result = 0
          if (verify) {
            if (req.body.role == "" || req.body.role === undefined) {
               result = await ExploereDetails.find({
                 organization: { $regex: ".*" + industry + ".*", $options: "i" },
              }).sort('expId')
              .limit(recordsLimit * 1)
              .skip(recordsToBeSkipped)

              count =  await ExploereDetails.find({
                organization: { $regex: ".*" + industry + ".*", $options: "i" },
                }).count()
            }
             else {
               result = await ExploereDetails.find({
                role: { $regex: ".*" + role + ".*", $options: "i" },
              }).sort('expId')
              .limit(recordsLimit * 1)
              .skip(recordsToBeSkipped)

              count = await ExploereDetails.find({
                role: { $regex: ".*" + role + ".*", $options: "i" },
              }).count()
            }
            const cityUrl = process.env.CITY_LOCATION_URL;
          const { locationAccess } = require("./functional");
            const apiId = process.env.API_ID_CITY;
            const headers = { Authkey: msgHeaderAuthkey };
            // console.log(result);
            let exploere = [];
            let detail = []; 
            const locationUrl = process.env.LOCATION_URL;
            let lati;
            let lang;
            for (let i = 0; i < result.length; i++) {
             lati = result[i].location.coordinates[0]
             lang = result[i].location.coordinates[1]
            //  {lat}&lon={lon}&limit={limit}&appid={API key}
             const url = locationUrl +'lat='+lati+'&lon='+lang+'&appid='+apiId
             const data = await locationAccess(url, headers);
            //  console.log(data.data[0].name)
              detail = {
                expId: result[i].expId,
                contact: result[i].contact,
                role: result[i].role,
                keyPoint: result[i].keyPoint,
                city :  data.data[0].name,
                image:
                  "https:docs.vourl.com/uploads/explorerImages/" +
                  result[i].image,
                tick: result[i].tick,
                description: result[i].description,
                location: result[i].location,
                organization: result[i].organization,
                createdAt: result[i].createdAt,
              };
              exploere.push(detail);
            }
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Successfully",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
                data: exploere,
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
  filterExploere,
};
