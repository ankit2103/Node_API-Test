const ExplorerDetails = require("../models/explorerDetail");
const dotenv = require("dotenv");
const { counter, UserDevices } = require("../models/userCounter");
const Honeybadger = require("@honeybadger-io/js");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;
const msgHeaderAuthkey = process.env.MSG_HEADER;

const exploere = async (req, res) => {
  try {
    if (req.get('AuthKey') === header) {
  
      if(req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp ){
       if (
        req.body.userId &&
        req.body.organization &&
        req.body.role &&
        Array.isArray(req.body.keyPoint) &&
        req.body.description &&
        req.body.contact &&
        req.body.latitude &&
        req.body.longitude
        ) {
        const userId = parseInt(escapeHtml(req.body.userId));
        const organization = escapeHtml(req.body.organization);
        const role = escapeHtml(req.body.role);
        const latitude = parseFloat(escapeHtml(req.body.latitude));
        const longitude = parseFloat(escapeHtml(req.body.longitude));
        const description = escapeHtml(req.body.description);
        const contact = parseInt(escapeHtml(req.body.contact));
        const keyPoint = escapeHtml(req.body.keyPoint).split(",");
        let keyPointName = [];
        const regExContact = /^[6-9]\d{9}$/;
            const validatecontact = regExContact.test(contact);
            if (validatecontact) {
        if (keyPoint.length > 0) {
          // console.log(keyPoint.length);
          for (let i = 0; i < keyPoint.length; i++) {
            keyPointName.push(keyPoint[i]);
          }
        } else throw new Error("ce1")
          const { getNextSequenceValueNew } = require("./functional");
          const idName = "expId";
          const seq = await getNextSequenceValueNew(counter, idName);
          const expId = "Exp_" + seq;
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
              if (test.length > 1) 
              imageData = test[test.length - 1];
              //   console.log(imageData);
              const splittedImageName = imageName.split(".");
              const extension = splittedImageName[splittedImageName.length - 1];
              const modifiedImageName =
                expId + "_" + splittedImageName[0] + "." + extension;
            //   console.log(modifiedImageName);
              const fileLocation = "uploads/explorerImages/" + modifiedImageName;
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
              //   console.log(keyPointName[0]);
              const headers = { Authkey: msgHeaderAuthkey };
              const url = process.env.CLOUD_BUCKET_NAME + "/" + fileLocation;
              const locationurl = process.env.LOCATION_URL;
              const { locationAccess } = require("./functional");
              // const location  = await locationAccess(locationurl,headers);   //url access  using axios.get(locationUrl, { headers })
              // console.log(location.data.city);
              await s3.upload(params).promise();
              const expsave = new ExplorerDetails({
                expId: expId,
                organization: organization,
                keyPoint: keyPointName,
                description: description,
                role: role,
                contact : contact,
                location :{
                  coordinates : [latitude, longitude],
                },
                tick: "unverified",
                image: modifiedImageName,
              });
              await expsave
                .save()
                .then((data) => {
                  res.send({
                    code: 200,
                    status: "success",
                    expId: expId,
                    message: "create Successfully",
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
             } catch (error) {
              console.log(error.message);
               res.send({
                code: 201,
                status: "fail",
                message: "something went wrong",
              });
            }
          } else throw new Error("ce2");
        } else {
          res.send({
            code: 201,
            status: "fail",
            message: "invalid contact number",
          });
        }
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
      } else throw new Error("ce3");
    }else{
        res.send({
            code: 201,
            status : "invalidAuth",
            message : "Access Denied",
        });
    }
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
