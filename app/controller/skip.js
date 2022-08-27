const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");

dotenv.config();

const skip = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.userId) {
        const userId = escapeHTML(req.body.userId);
        const verify = await UserDetails.exists({userId :userId});
        if (verify) {
          const token = jwt.sign({ userId }, process.env.SECREAT_KEY, {
            expiresIn: Date.now()+86400, // expires in 24 hours
          });
          if (token) {
            res.send({
              code: 200,
              status: "success",
              message: "skip",
              userId: userId,
              jwt: token,
            });
          } else throw new Error("sk1");
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
    } else throw new Error("sk3");
  } catch (error) {
    // console.log(error.message);
    res.send({
      code : 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  skip,
};
