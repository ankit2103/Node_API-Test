const UserDetails = require("../models/userDetail");
const dotenv = require("dotenv");
const Honeybadger = require("@honeybadger-io/js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


dotenv.config();


const securePassword = async (password) => {
  // return password;
  const passwordHash = bcryptjs.hash(password, 10); //(,10) for decrypt of length
  return passwordHash;
};

const setPassword = async (req, res) => {
  try {
    if (req.get("AuthKey") == process.env.HEADER) {
      if (req.body.password && req.body.userId) {
        const userId = req.body.userId;
        const password = await securePassword(req.body.password);
        const verify = await UserDetails.findOne({ userId });
        if (verify) {
            const detail = await UserDetails.findOneAndUpdate({userId : userId},
              { 
                password : password,
                profileComplete : 20 
             })
             if(detail){
              const token = jwt.sign({ userId }, process.env.SECREAT_KEY, {
                expiresIn: Date.now()+86400,// expires in 24 hours
              });
              res.send({
                code: 200,
                status: "success",
                jwt : token,
                userId: userId,
                message: "create password Successfully",
              });
            }else throw new Error("sp1");
            } else {
              res.send({
                code: 201,
                status: "fail",
                message: "Invalid  User",
              });
            }
          }else {
            res.send({ code: 201, status: "fail", message: "Invalid Request" });
          }
        } else throw new Error("sp2");

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
  setPassword
};
