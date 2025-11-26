const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    cpassword: {
        type: String,
        default: null,
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userModel);
module.exports = User;
