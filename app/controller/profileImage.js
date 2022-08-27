const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const profilepic = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
      // console.log(req.jwtId.userId);
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp) {
        if (req.body.userId && req.body.type) {
          const userId = parseInt(escapeHtml(req.body.userId));
          const type = escapeHtml(req.body.type);
          const user = await UserDetails.findOne({ userId }).exec();
          if (user) {
            let imageName, imageData;
            if (req.body.image) {
              imageName = req.body.image.imageName;
              imageData = req.body.image.imageData;
            } else {
              imageName = undefined;
              imageData = undefined;
            }
            if (imageName && imageData) {
              const { S3 } = require("aws-sdk");
              const ID = process.env.CLOUD_ID;
              const SECRET = process.env.CLOUD_SECRET;
              const BUCKET_NAME = process.env.CLOUD_BUCKET_NAME;
              const s3 = new S3({
                accessKeyId: ID,
                secretAccessKey: SECRET,
                region: process.env.REGION,
              });
              if (type == "profile") {
                let test = imageData.split(",");
                if (test.length > 1) imageData = test[test.length - 1];
                const splittedImageName = imageName.split(".");
                const extension =
                  splittedImageName[splittedImageName.length - 1];
                const modifiedImageName =
                  userId + "_" + splittedImageName[0] + "." + extension;
                const fileLocation =
                  "uploads/profileImages/" + modifiedImageName;
                var ContentType;
                if (extension === "jpg" || extension === "jpeg")
                  ContentType = "image/jpeg";
                else if (extension === "png") ContentType = "image/png";
                const buff = Buffer.from(imageData, "base64");
                var params = {
                  Bucket: BUCKET_NAME,
                  Key: fileLocation,
                  Body: buff,
                  ContentEncoding: "base64",
                  ContentType,
                  ACL: "public-read",
                };
                const url = "https:"+process.env.CLOUD_BUCKET_NAME + "/" + fileLocation;
                await s3.upload(params).promise();
                if(user.imageUrl == undefined){
                user.profileImage = modifiedImageName;
                }
                else{
                user.imageUrl = modifiedImageName;
                }
                user.profileComplete = user.profileComplete + 10;
                await user
                  .save()
                  .then((data) => {
                    res.send({
                      code: 200,
                      status: "success",
                      message: "Image Upload Successfully",
                      documentUrl: url,
                    });
                  })
                  .catch((err) => {
                    console.log(err.message);
                    return res.send({
                      code: 201,
                      status: "fail",
                      message: "something went wrong",
                    });
                  });
              } else {
                let test = imageData.split(",");
                if (test.length > 1) imageData = test[test.length - 1];
                const splittedImageName = imageName.split(".");
                const extension =
                  splittedImageName[splittedImageName.length - 1];
                const modifiedImageName =
                  userId + "_" + splittedImageName[0] + "." + extension;
                const fileLocation = "uploads/coverImages/" + modifiedImageName;
                var ContentType;
                if (extension === "jpg" || extension === "jpeg")
                  ContentType = "image/jpeg";
                else if (extension === "png") ContentType = "image/png";
                const buff = Buffer.from(imageData, "base64");
                var params = {
                  Bucket: BUCKET_NAME,
                  Key: fileLocation,
                  Body: buff,
                  ContentEncoding: "base64",
                  ContentType,
                  ACL: "public-read",
                };
                const url = process.env.CLOUD_BUCKET_NAME + "/" + fileLocation;
                await s3.upload(params).promise();
                user.coverImage = modifiedImageName;
                user.profileComplete = user.profileComplete + 10;
                await user
                  .save()
                  .then((data) => {
                    res.send({
                      code: 200,
                      status: "success",
                      message: "Image Upload Successfully",
                      documentUrl: url,
                    });
                  })
                  .catch((err) => {
                    console.log(err.message);
                    return res.send({
                      code: 201,
                      status: "fail",
                      message: "something went wrong",
                    });
                  });
              }
            } else throw new Error("pI1");
          } else {
            res.send({ code: 201, status: "fail", message: "Invalid User" });
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
    } else throw new Error("pI2");
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
  profilepic,
};
