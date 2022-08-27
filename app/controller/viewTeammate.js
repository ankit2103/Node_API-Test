const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
const msgHeaderAuthkey = process.env.MSG_HEADER;

dotenv.config();
const header = process.env.HEADER;
const user = async (req, res) => {
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
            const result = await UserDetails.find()
              .sort("userId")
              .limit(recordsLimit)
              .skip(recordsToBeSkipped)
              .lean()
              .exec();
            // console.log(result)
            const count = await UserDetails.find().count()
            let user = [];
            let detail = [];
            for (let i = 0; i < result.length; i++) {
              if (result[i].userId != userId) {
                if (result[i].verified == "Yes") {
                  if (result[i].imageUrl == undefined || result[i].imageUrl == "")
                   {
                    if ( result[i].profileImage == undefined ||  result[i].profileImage == "") 
                    {
                      image = "https:docs.vourl.com/uploads/defaultProfileImages/Def_1000_profile.jpeg";
                    } 
                    else {
                       image = "https:docs.vourl.com/uploads/profileImages/" + result[i].profileImage;
                     }
                  } else {
                    image = result[i].imageUrl;
                  }
                  let stateName = "";
                  if(result[i].skill[0] == undefined || result[i].skill[0] == ''){
                    skill = '' 
                  }else{
                    skill = result[i].skill
                  }

                  if(result[i].experience[0] == undefined || result[i].experience[0] == ' '){
                    role = ' ';
                  }
                  else{
                    role = result[i].experience[0].title
                  }
                  if(result[i].description == undefined || result[i].description == ''){
                    desc = '' 
                  }else{
                    desc = result[i].description
                  }
                  // const location = result[i].cityDistrict + "," + stateName;
                  const location = result[i].cityDistrict
                  detail = {
                    userId: result[i].userId,
                    userName : result[i].firstName + ' ' +result[i].lastName,
                    contact: result[i].contact,
                    role: role,
                    keyPoint: skill,
                    image: image,
                    location: location,
                    verified: result[i].verified,
                    description: desc,
                    // organization: result[i].organization,
                    createdAt: result[i].createdAt,
                  };
                  user.push(detail);
                }
              }
            }
            if (result) {
              res.send({
                code: 200,
                status: "success",
                message: "Successfully",
                totalPages: Math.ceil(count / recordsLimit),
                currentPage: page,
                data: user,
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
  user,
};
