const ExplorerDetails = require("../models/explorerDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const msgHeaderAuthkey = process.env.MSG_HEADER;

const search = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId ) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const userverfy = await UserDetails.exists({ userId });
          const recordsLimit = 12;
          const page = parseInt(req.body.page)
          const recordsToBeSkipped = (parseInt(req.body.page) - 1) * recordsLimit;
          const cityUrl = process.env.CITY_LOCATION_URL;
          const apiId = process.env.API_ID_CITY;
          const headers = { Authkey: msgHeaderAuthkey };
          let count = 0
          const { locationAccess } = require("./functional");
          let result = undefined
          let dataFound = true;
          if (userverfy) {
            const search = escapeHtml(req.body.search);
            result = await ExplorerDetails.find({
              $or: [
                { keyPoint: search },
                { role: { $regex: ".*" + search + ".*", $options: "i" } },
                {
                  organization: { $regex: ".*" + search + ".*", $options: "i" },
                },
              ],
            }) 
            .sort('expId')
            .limit(recordsLimit * 1)
            .skip(recordsToBeSkipped)
            .exec();
            // console.log(result);
            count = await ExplorerDetails.find({
              $or: [
                { keyPoint: search },
                { role: { $regex: ".*" + search + ".*", $options: "i" } },
                {
                  organization: { $regex: ".*" + search + ".*", $options: "i" },
                },
              ],
            }).count()
            if (result.length == 0) {
              const url =
                cityUrl + "?q=" + search + "&units=metric&APPID=" + apiId;
              // console.log(url)
              const data = await locationAccess(url, headers);
              if (data) {
                console.log(2334);
                const longitude = data.data.coord.lon;
                const latitude = data.data.coord.lat;
                // console.log(data.data.coord.lon)
                result = await ExplorerDetails.find({
                  location: {
                    type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                    coordinates: [latitude, longitude],
                  },
                })
                .sort('expId')
                .limit(recordsLimit * 1)
                .skip(recordsToBeSkipped)
                  .lean()
                  .exec();
                  count = await ExplorerDetails.find({
                    location: {
                      type: "Point", //filter by coordinates near longitute first priority 78.099  = 75.898,89.506,34.565 near of location
                      coordinates: [latitude, longitude],
                    },
                  }).count()

              } else {
                dataFound = false;
                result = await ExplorerDetails.find()
                .sort('expId')
                .limit(recordsLimit * 1)
                .skip(recordsToBeSkipped)
                  .exec();
                count = await ExplorerDetails.find().count()

               }

            }

            //  const value = await ExplorerDetails.find()
            //   .sort({ _id: 1 })
            //   .skip(recordsToBeSkipped)
            //   .limit(12)
            //   .exec();
            //   // console.log(value)
            //   let response = []
            // result =  value.filter(
            //   (item) =>  item.role.includes(search)|| item.organization.includes(search)
            // );
            // result =  value.filter(
            //   (item) =>  item.role.includes(search)|| item.organization.includes(search)
            // );
            // console.log(result.length)
            // }
            // console.log(result)
            if (dataFound) {
              let exploere = [];
              let detail = [];
              const locationUrl = process.env.LOCATION_URL;
              let lati;
              let lang;
              for (let i = 0; i < result.length; i++) {
                lati = result[i].location.coordinates[0];
                lang = result[i].location.coordinates[1];
                //  {lat}&lon={lon}&limit={limit}&appid={API key}
                const url = locationUrl + "lat=" +  lati + "&lon=" + lang + "&appid=" + apiId;
                const data = await locationAccess(url, headers);
                //  console.log(data.data[0].name)
                detail = {
                  expId: result[i].expId,
                  contact: result[i].contact,
                  role: result[i].role,
                  keyPoint: result[i].keyPoint,
                  city: data.data[0].name,
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
              let exploere = [];
              let detail = [];
              const locationUrl = process.env.LOCATION_URL;
              let lati;
              let lang;
              for (let i = 0; i < result.length; i++) {
                lati = result[i].location.coordinates[0];
                lang = result[i].location.coordinates[1];
                //  {lat}&lon={lon}&limit={limit}&appid={API key}
                const url =locationUrl +"lat=" + lati +"&lon=" +lang + "&appid=" +apiId;
                const data = await locationAccess(url, headers);
                //  console.log(data.data[0].name)
                detail = {
                  expId: result[i].expId,
                  contact: result[i].contact,
                  role: result[i].role,
                  keyPoint: result[i].keyPoint,
                  city: data.data[0].name,
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
              res.send({
                code: 201,
                status: "fail",
                message: "No data found",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
                data : exploere
              });
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
