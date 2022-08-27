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
    if (req.get("AuthKey") === header) {
      // console.log(req.jwtId.userId);
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId ) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const latitude = escapeHtml(req.body.latitude);
          const longitude = escapeHtml(req.body.longitude);
          const verify = await UserDetails.findOne({ userId: userId });
          const recordsLimit = 12;
          const page = parseInt(req.body.page)
          const recordsToBeSkipped = (parseInt(req.body.page) - 1) * recordsLimit;
          // const count = await ExploereDetails.countDocuments();
          let count = 0
          // console.log(latitude)
          if (verify) {
            if((latitude == '' && longitude == '') || (latitude == undefined && longitude == undefined)){
              console.log(34)
              const city = verify.cityDistrict;
              const cityUrl = process.env.CITY_LOCATION_URL;
              const apiId = process.env.API_ID_CITY
              const headers = { Authkey: msgHeaderAuthkey };
              const { locationAccess } = require("./functional"); 
              const url = cityUrl +'?q='+city+'&units=metric&APPID='+apiId
              // console.log(url)
              const data = await locationAccess(url, headers);
              const longitude = data.data.coord.lon
              const latitude = data.data.coord.lat
              // console.log(data.data.coord.lon)
                const result = await ExploereDetails.find({
                  location: {
                    $near: {
                      $geometry: {
                        type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                        coordinates: [latitude, longitude],
                      },
                    },
                  },
                })
                  .limit(recordsLimit * 1)
                  .skip(recordsToBeSkipped)
                  .lean()
                  .exec();
                // console.log(result)
                count = await ExploereDetails.find({
                    location: {
                    $near: {
                      $geometry: {
                        type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                        coordinates: [latitude, longitude],
                      },
                    },
                  },
                }).count()
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
               
            }else{
             const result = await ExploereDetails.find({
              location: {
                $near: {
                  $geometry: {
                    type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                    coordinates: [latitude, longitude],
                  },
                },
              },
             }) 
               .limit(recordsLimit * 1)
               .skip(recordsToBeSkipped)
              .lean()
              .exec();

              count  = await ExploereDetails.find({
                location: {
                  $near: {
                    $geometry: {
                      type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                      coordinates: [latitude, longitude],
                    },
                  },
                },
               }).count()
              // console.log(result)
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
                message: "Successfully",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
                data: exploere,
              });
              // console.log(result);
            } else throw new Error("ce3");
           }
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
  exploere,
};
