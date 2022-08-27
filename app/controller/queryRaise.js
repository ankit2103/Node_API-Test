const Query = require("../models/query");
const dotenv = require("dotenv");
const { escapeHtml } = require("./functional");
dotenv.config();


const queryRaise = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.email && req.body.name && req.body.message) {
        const email = escapeHtml(req.body.email);
        const name = escapeHtml(req.body.name);
        const message = escapeHtml(req.body.message);
        const msg = new Query({
          name: name,
          email: email,
          message: message,
        });
        await msg.save().
        then((data) => {
          res.send({
            code: 200,
            status: "success",
            message: "Query Raised",
          });
        });
      } else {
        res.send({ code: 201, status: "fail", message: "Invalid Request" });
      }
    } else throw new Error("qr2");
  } catch (error) {
    console.log(error.message);
    res.send({
      code : 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

module.exports = {
  queryRaise
};
