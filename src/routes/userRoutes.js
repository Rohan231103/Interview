const express = require("express");
const Router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

Router.post("/register", upload.single("photo"), userController.registerUser);
Router.post("/login", userController.login);
Router.put("/update/:userId",auth.authorizeToken, upload.single("photo"), userController.updateUser);
Router.post("/logout", userController.logout);
Router.delete("/delete/:userId",auth.authorizeToken, userController.deleteUser);

module.exports = Router;
