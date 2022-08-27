const axios = require("axios");
const Honeybadger = require("@honeybadger-io/js");

const genOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const getNextSequenceValue = async (counter) => {
  try {
    const data = await counter.findById("userId").exec();
    if (data === null) {
      const res = counter({ _id: "userId" });
      const seq = await res.save();
      return seq.seq;
    }
    const res = await counter
      .findByIdAndUpdate(
        "userId",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
      .exec();

    return res.seq;
  } catch (error) {
    // Honeybadger.notify(`f1: ${error.message}`);
    return error;
  }
};

const getNextSequenceValueNew = async (counter,idName) => {
  try {
    const data = await counter.findById(idName).exec();
    if (data === null) {
      const res = counter({ _id: idName });
      const seq = await res.save();
      return seq.seq;
    }
    const res = await counter
      .findByIdAndUpdate(
        idName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      )
      .exec();

    return res.seq;
  } catch (error) {
    // Honeybadger.notify(`f1: ${error.message}`);
    return error;
  }
};


const getOtpTimeLimit = (OtpSenttime) => {
  return OtpSenttime + 600000; //10min = 600000 millisecond
};

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.toString().replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}


const otpsend = async (otpUrl, body, headers, user) => {
  try {
    const result = await axios.post(otpUrl, body, { headers });
      await user.save();
      return true;
    if (result.data.code === 200 && result.data.status === "success") {
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Honeybadger.notify(`f3: ${error.message}`);
    return false;
  }
};

const locationAccess = async (locationUrl, headers) => {
try{
  const result = await axios.get(locationUrl ,{ headers });
  // console.log(result)
  if (result.status === 200 && result.statusText === "OK") {
    return result;
  } else {
    return false;
  }
  
}catch(error){
  return false;
}
};



const checkDevice = async (shopDeviceModel, shopId, device_status) => {
  try {
    const result = await shopDeviceModel.findOne({ shopId });
    const result2 = result.device_status.find((device) => {
      return device.deviceId === device_status.deviceId;
    });
    if (result2) {
      const result3 = result.device_status.indexOf(result2);
      result.device_status[result3] = device_status;
      await result.save();
    } else {
      result.device_status = result.device_status.concat(device_status);
      await result.save();
    }
    return true;
  } catch (error) {
    Honeybadger.notify(`f4: ${error.message}`);
    return false;
  }
};

const checkOTP = async (userDetailsmodel,userId,emailotp,contactotp) => {
  try {
    const user = await userDetailsmodel.findOne({userId});
    if (!user) {
      return false;
    }
    const isMatchcontact = parseInt(contactotp) === user.contactStatus.OTP;
    const isMatchemail = parseInt(emailotp) === user.emailStatus.OTP;
    const currentStatuscontact = user.contactStatus.contactVerification;
    const currentStatusemail  = user.emailStatus.emailVerification;
    const validTimecontact = getOtpTimeLimit(user.contactStatus.otpTime);
    const validTimeemail  = getOtpTimeLimit(user.emailStatus.otpTime);

       if (Date.now() <= validTimecontact && Date.now() <= validTimeemail && isMatchcontact && isMatchemail) {
        if (currentStatuscontact === "unverified" &&  currentStatusemail === "unverified") {
        user.contactStatus.contactVerification = "verified";
        user.emailStatus.emailVerification = "verified";
        user.verified = 'Yes';   
      }
      user.profileComplete = 15,
      user.contactStatus.OTP = undefined;
      user.contactStatus.otpTime = undefined;
      user.emailStatus.OTP = undefined;
      user.emailStatus.otpTime = undefined;

      await user.save();
      return {
        status: true,
        userId:  user.userId,
        message: user.contactStatus.contactVerification,
        existingUser: user.firstName ? "Yes" : "No",
      };
    } else if (Date.now() > validTimecontact  && Date.now() > validTimeemail) {
      user.contactStatus.OTP = undefined;
      user.contactStatus.otpTime = undefined;
      user.emailStatus.OTP = undefined;
      user.emailStatus.otpTime = undefined;
      await  user.save();
      return {
        status: false,
        message : "OTP Expired",
      };
     } else {
      return {
        status: false,
        message : "Invalid OTP",
       };
    }
  } catch (error) {
    // Honeybadger.notify(`f5: ${error.message}`);
    console.log(error.message);
    return false;
  }
};

module.exports = {
  genOTP,
  getNextSequenceValue,
  escapeHtml,
  otpsend,
  checkDevice,
  checkOTP,
  locationAccess,
  getNextSequenceValueNew,
};


