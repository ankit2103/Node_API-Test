const IdeaDetails = require("../models/ideaDetail");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const idea = async (req, res) => {
  try {
    if (req.get('AuthKey') === header) {
        // console.log(req.jwtId.userId);
        // if(req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp ){
      if (
        req.body.name &&
        req.body.tagLine &&
        Array.isArray(req.body.tags) &&
        req.body.description &&
        req.body.userId
      ) {
        const name = escapeHtml(req.body.name);
        const tagLine = escapeHtml(req.body.tagLine);
        const description = escapeHtml(req.body.description);
        const tags = escapeHtml(req.body.tags).split(",");
        const userId = parseInt(escapeHtml(req.body.userId));
        const userVerify = await UserDetails.findOne({ userId }).exec();
        let tagsName = [];
        if (tags.length > 0) {
          // console.log(tags.length);
          for (let i = 0; i < tags.length; i++) {
            tagsName.push(tags[i]);
          }
        }
        if (userVerify) {
          const { getNextSequenceValueNew } = require("./functional");
          const idName = "ideaId";
          const seq = await getNextSequenceValueNew(counter, idName);
          const ideaId = "Idea_" + seq;
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
            try {
              let test = imageData.split(",");
              if (test.length > 1) imageData = test[test.length - 1];
              // console.log(imageData);
              const splittedImageName = imageName.split(".");
              const extension = splittedImageName[splittedImageName.length - 1];
              const modifiedImageName =
                ideaId + "_" + splittedImageName[0] + "." + extension;
              //   console.log(modifiedImageName);
              const fileLocation = "uploads/ideaImages/" + modifiedImageName;
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
              //   console.log(tagsName[0]);
              const _id = userVerify._id;
              const url = process.env.CLOUD_BUCKET_NAME + "/" + fileLocation;
              await s3.upload(params).promise();
              const ideasave = new IdeaDetails({
                ideaId: ideaId,
                userId: _id,
                ideaName: name,
                tag: tagsName,
                description: description,
                tagLine: tagLine,
                logoImage: modifiedImageName,
              });
              await ideasave
                .save()
                .then((data) => {
                  res.send({
                    code: 200,
                    status: "success",
                    ideaId: ideaId,
                    message: "Create Successfully",
                    documentUrl: url,
                  });
                })
                .catch((err) => {
                  console.log(err.message);
                  
                  return res.send({
                    code: 201,
                    status: "fail",
                    message: "Something Went Wrong",
                  });
                });
             } catch (error) {
              console.log(error.message);
               res.send({
                code: 201,
                status: "fail",
                message: "Something Went Wrong",
              });
            }
          } else throw new Error("cI1");
        }  else {
          res.send({
            code: 201,
            status: "fail",
            message: "Invalid User",
          });
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    //    }else{
    //     res.send({
    //         code: 201,
    //         status : "invalidAuth",
    //         message : "Access Denied",
    //     });
    // }
    } else throw new Error("cd4");
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
  idea,
};
