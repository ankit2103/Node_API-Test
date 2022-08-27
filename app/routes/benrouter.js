const express = require("express");
const app = express();
const router = new express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

app.use(router);
const authentication = async (req, res, next) => {
  try {
    let token = req.get("App-Token-Access");
    if (token) {
      const user = await jwt.verify(token, process.env.SECREAT_KEY);
      req.jwtId = user;
    } else {
      console.log(token)
      res.send({
        code: 201,
        status: "fail",
        message: "Something Went Wrong",
      });
      console.log("jwterror");
    }
    next();
  } catch (error) {
    console.log(error.message);
    res.send({
      code: 201,
      status: "fail",
      message: "Something Went Wrong",
    });
  }
};

const signups = require("../controller/signups1");
const signupss = require("../controller/signups2");
const verifyotp = require("../controller/verifyOTP");
const changeEmail = require("../controller/changeEmail");
const changeContact = require("../controller/changeContact");
const skip = require("../controller/skip");
const setPassword = require("../controller/setPassword");
const queryRaise = require("../controller/queryRaise");
const login = require("../controller/login");
const emailOtp = require("../controller/emailOtp");
const loginOtp = require("../controller/loginOtp");
const mobileOtp = require("../controller/contactOtp");
const forgetOtp = require("../controller/forgetOtp");
const createIdea = require("../controller/createIdea");
const viewProfileIdea = require("../controller/viewProfileIdea");
const serchIdea = require("../controller/serchIdea");
const exploere = require("../controller/createExploere");
const inquiry = require("../controller/inquiry");
const service = require("../controller/createService");
const viewExploere = require("../controller/viewExploere");
const serchExploere = require("../controller/serchExploere");
const profileImage = require("../controller/profileImage");
const userDescription = require("../controller/userDescription");
const userSkill = require("../controller/userSkill");
const userEducation = require("../controller/userEducation");
const userExperience = require("../controller/userExperience");
const filterExploere = require("../controller/filterExploere");
const benVideo = require("../controller/benVideo");
const homeProfile = require("../controller/homeProfile");
const defaultImage = require("../controller/defaultProfileImage");
const viewTeammate = require("../controller/viewTeammate");
const viewService = require("../controller/viewServices");
const viewExploerePage = require("../controller/viewExploerePaging");
const viewIdea = require("../controller/viewIdea");
const emailVerification = require("../controller/emailVerification");













router.post("/signupS1", signups.signups1);
router.post("/signupS2", signupss.signups2);
router.post("/signupOtpVerify", verifyotp.verifyOTP);
router.post("/changeContact", changeContact.changeContact);
router.post("/changeEmail", changeEmail.changeEmail);
router.post("/setPassword", setPassword.setPassword);
router.post("/skipPassword", skip.skip);
router.post("/queryRaise", queryRaise.queryRaise);
router.post("/login", login.Login);
router.post("/emailOtp", emailOtp.emailOtp);
router.post("/loginOtp", loginOtp.LoginOtp);
router.post("/contactOtp", mobileOtp.mobileOtp);
router.post("/forgetOtp", forgetOtp.forgetOtp);
router.post("/addIdea", authentication, createIdea.idea);
router.post("/viewProfileIdea", authentication, viewProfileIdea.viewIdea);
router.post("/addExploere",authentication, exploere.exploere);
router.post("/addInquiry", authentication, inquiry.inquiry);
router.post("/addService", service.service);
router.post("/viewExploere", authentication, viewExploere.exploere);
router.post("/serchIdea", authentication, serchIdea.search);
router.post("/serchExploere", authentication, serchExploere.search);
router.post("/profileImage", authentication, profileImage.profilepic);
router.post("/addUserDescription", authentication, userDescription.description);
router.post("/addUserSkill", authentication, userSkill.skill);
router.post("/addUserEducation", authentication, userEducation.education);
router.post("/addUserExperience", authentication, userExperience.experience);
router.post("/filterExploere", authentication, filterExploere.filterExploere);
router.post("/benVideo", authentication, benVideo.video);
router.post("/notificationProfile", authentication, homeProfile.notification);
router.post("/defaultImage", authentication, defaultImage.profilepic);
router.post("/viewTeammate", authentication, viewTeammate.user);
router.post("/viewService", authentication, viewService.services);
router.post("/viewExploerePage", viewExploerePage.exploere);
router.post("/viewIdea", authentication, viewIdea.viewIdea);
router.post("/emailVerification",emailVerification.verification);
















module.exports = router;
