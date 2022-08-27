const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
// const URI = process.env.BUSINESS_DB_URI;
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

//connection to database
// const conn = mongoose.createConnection(URI, opts);

// counter schema to keep track of shop id
const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 },
  },
  { timestamps: true }
);
// module.exports = mongoose.model("SignUp", Signup);

module.exports.counter  = mongoose.model("counter", counterSchema);

// //schema for otp requests
// const userdevicesSchema = new mongoose.Schema({
//   userId: Number,
//   device_status: [
//     {
//       deviceId: String,
//       fbToken: String,
//       deviceName: String,
//       deviceOS: String,
//       OSVersion: String,
//       appVersion: String,
//       userStatus: String,
//     },
//   ],
// });

// userdevicesSchema.index({ userId: 1 }, { unique: true });

// module.exports.UserDevices  = mongoose.model("deviceinfo", userdevicesSchema);


// module.exports.UserDevices = UserDevices;
