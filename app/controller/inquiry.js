const Inquiry = require("../models/inquiry");
const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const { escapeHtml } = require("./functional");
dotenv.config();
const header = process.env.HEADER;

const inquiry = async (req, res) => {
  try {
    if (req.get("AuthKey") === header) {
     // { userId: 1151, iat: 1660717548, exp: 1662379343728 }
      if (req.jwtId.userId == req.body.userId && Date.now() <= req.jwtId.exp ) {
        if (
          req.body.userId &&
          req.body.title &&
          req.body.category &&
          req.body.description &&
          Array.isArray(req.body.tag)
        ){
          const userId = escapeHtml(req.body.userId);
          const title = escapeHtml(req.body.title);
          const tag = escapeHtml(req.body.tag).split(",");
          const description = escapeHtml(req.body.description);
          const category = escapeHtml(req.body.category);
          const verify = await UserDetails.findOne({ userId });
          if (verify) {
            let tagName = [];
            for (let i = 0; i < tag.length; i++) {
              tagName.push(tag[i]);
            }
            const inq = new Inquiry({
              title: title,
              tag: tagName,
              description: description,
              userId: userId,
              category: category,
            });
            await inq.save().then((data) => {
              res.send({
                code: 200,
                status: "success",
                message: "Inquiry Create Successfully",
              });
            });
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
    } else throw new Error("i1");
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  inquiry,
};
