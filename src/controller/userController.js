const { AES, enc } = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../modules/userModel");
const responseManager = require("../helper/responseManager");
const validation = require("../helper/validation");

exports.registerUser = async (req, res) => {
  try {
    const { error } = validation.registerValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password, cpassword } = req.body;

    if (!req.file) {
      return responseManager.onBadRequest("Photo is required", res);
    }
    const photo = req.file.filename;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return responseManager.onBadRequest(
        "User already exists with this email",
        res
      );
    }

    if (password !== cpassword) {
      return responseManager.onBadRequest(
        "Password and Confirm Password do not match",
        res
      );
    }

    const encryptedPassword = AES.encrypt(
      password,
      process.env.PASSWORD_SECRET
    ).toString();

    await User.create({
      name,
      email,
      password: encryptedPassword,
      photo,
    });

    return responseManager.create("User registered successfully", res);
  } catch (error) {
    console.log(":::::error:::::", error);
    return responseManager.internalServer(error, res);
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = validation.loginValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (!existing) {
      return responseManager.notFoundRequest(
        "User not found with this email",
        res
      );
    }

    const decryptedPassword = AES.decrypt(
      existing.password,
      process.env.PASSWORD_SECRET
    ).toString(enc.Utf8);

    if (decryptedPassword !== password) {
      return responseManager.unauthorisedRequest(res);
    }

    const token = jwt.sign({ id: existing._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.clearCookie("authorization");
    res.cookie("authorization", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return responseManager.onSuccess("Login successful", { token }, res);
  } catch (error) {
    console.log(":::::error:::::", error);
    return responseManager.internalServer(error, res);
  }
};

exports.logout = async (req,res) => {
  try {
    res.clearCookie("authorization", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    return responseManager.onSuccess("Logout Successfully !", {}, res);
  } catch (error) {
    console.log(":::::error:::::",error);
    return responseManager.internalServer(error,res)
  }
}

exports.updateUser = async (req, res) => {
  try {
    if (!req.token || !req.token.id) {
      return responseManager.unauthorisedRequest(res);
    }

    const { userId } = req.params;
    const { name, email, password, cpassword } = req.body;
    let updateData = { name, email, password, cpassword };

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return responseManager.notFoundRequest("User not found", res);
    }

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    const updated = await User.findOneAndUpdate(
      { _id: req.token.id },
      updateData,
      { new: true }
    );

    if (!updated) {
      return responseManager.notFoundRequest("User not found", res);
    }
    return responseManager.onSuccess("User updated successfully", updated, res);
  } catch (error) {
    console.log(":::::error:::::", error);
    return responseManager.internalServer(error, res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.token || !req.token.id) {
      return responseManager.unauthorisedRequest(res);
    }
    const { userId } = req.params;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return responseManager.notFoundRequest("User not found", res);
    }
    await User.findByIdAndDelete(userId);
    return responseManager.onSuccess("User deleted successfully", 1, res);
  } catch (error) {
    console.log(":::::error:::::", error);
    return responseManager.internalServer(error, res);
  }
}