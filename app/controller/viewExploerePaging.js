const ExploereDetails = require("../models/explorerDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
const msgHeaderAuthkey = process.env.MSG_HEADER;

dotenv.config();
const header = process.env.HEADER;
const exploere = async (req, res) => {
  try {
      // console.log(req.jwtId.userId);
          const limit = 10;
          const page  = parseInt(req.body.page)
          const recordsToBeSkipped = (parseInt(req.body.page) - 1) * limit;
          // console.log(latitude)
             const result = await ExploereDetails.find()
             .sort('expId')
              .limit(limit * 1)
              .skip(recordsToBeSkipped)
              .exec();
              // console.log(result)
              const count1 = await ExploereDetails.find().count()
              console.log(count1)
              const count = await ExploereDetails.countDocuments();
             const bodyAuthkey = process.env.MSG_BODY_AUTHKEY;
            let exploere = [];
            let detail = []; 
            const headers = { Authkey: msgHeaderAuthkey };
            const locationUrl = process.env.LOCATION_URL;
            const apiId = process.env.API_ID_CITY;
            let lati;
            let lang;
           const { locationAccess } = require("./functional"); 
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
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                data: exploere,
              });
              // console.log(result);
            } else throw new Error("ce3");

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
  exploere,
};
