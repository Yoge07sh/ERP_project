const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

async function doAdminLogin(req, res) {
  try {
    console.log(req.body);
    let admin = await Admin.findOne({ email: req.body.email });
    console.log(admin)
    if (!admin) {
      res
        .status(500)
        .send({ success: false, message: "invalid UserName/Password" });
    } else {
      let validPassword = await bcrypt.compare(req.body.password, admin.password)
      console.log(validPassword, 'valid password')
      if (validPassword) {
        admin.lastLogin = new Date();
        await admin.save();
        let secret_key = 'b2Vfb3ZlcnRoZXJlX29yX3NvbWV0aGluZ19lbHNld2hlcmU'
        let token = jwt.sign({ _id: admin._id, email: admin.email }, secret_key, {
          expiresIn: '1hr'
        })
        let data = {
          name: admin.firstName,
          email: admin.email,
          token: token
        }
        res.status(200).send({ success: true, data: data })
      } else {
        res
          .status(500)
          .send({ success: false, message: "invalid username/passowrd" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
}
async function doUserlogin(req, res) {
  try {

    let user = await User.findOne({ email: req.body.email })
    if (!user) {
      res.status(500).send({ success: false, message: "invalid user email or password" })
    } else {
      let validPassword = await bcrypt.compare(req.body.password, user.password)
      if (validPassword) {
        user.lastLogin = new Date()
        await user.save()
        let secret_key = 'b2Vfb3ZlcnRoZXJlX29yX3NvbWV0aGluZ19lbHNld2hlcmU'
        let token = jwt.sign({ _id: user._id, email: user.email }, secret_key, {
          expiresIn: '1hr'
        })
        let data = {
          name: user.firstName,
          email: user.email,
          token: token
        }
        res.status(200).send({ success: true, data: data })
      } else {
        res.status(500).send({ success: false, message: "invalid user email or password" })
      }

    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false })

  }
}
module.exports = {
  doAdminLogin,
  //   addUser,
  //   sendOtpForSignup,
  doUserlogin,
  //   verifyOtp,
  //   sendResetOtp,
  //   resetPassword
};
