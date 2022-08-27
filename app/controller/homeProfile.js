const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;

const notification = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const user = await UserDetails.exists({ userId: userId });
          if (user) {
            const detail = await UserDetails.findOne(
              { userId: userId },
              {
                imageUrl: 1,
                notification: 1,
                firstName: 1,
                lastName: 1,
                _id: 0,
                profileImage: 1,
                profileComplete: 1,
                verified: 1,
              }
             );
            if(detail) {
              if (detail.imageUrl == undefined || detail.imageUrl == "") {
                if ( detail.profileImage == undefined ||  detail.profileImage == "") {
                  image = "https:docs.vourl.com/uploads/defaultProfileImages/Def_1000_profile.jpeg";
                } 
                else {
                   image = "https:docs.vourl.com/uploads/profileImages/" + detail.profileImage;
                 }
              } else {
                image = detail.imageUrl;
              }
              const inforamtion = {
                name: detail.firstName + ' ' + detail.lastName,
                notification : detail.notification,
                image  : image,
                profileComplete: detail.profileComplete,
                verified: detail.verified,
              };
              res.send({
                code: 200,
                status: "success",
                data: inforamtion,
                message: "Successfully",
              });
            } else throw new Error("hp1");
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
    } else {
      res.send({ code: 201, status: "fail", message: "Invalid Request" });
    }
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
  notification,
};
