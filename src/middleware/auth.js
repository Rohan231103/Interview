const jwt = require("jsonwebtoken");
const responseManager = require("../helper/responseManager");
const mongoose = require("mongoose");

exports.authorizeToken = async (req,res,next) => {
    const token = req.cookies["authorization"] || req.headers["authorization"];
    if(typeof token !== 'undefined'){
        try {
            const auth = jwt.verify(token, process.env.JWT_SECRET);
            if(auth.id){
                auth.id = new mongoose.Types.ObjectId(auth.id);
            }
            req.token = auth;
            return next();
        } catch (error) {
            res.clearCookie("authorization");
            return responseManager.unauthorisedRequest(res);
        }
    }else{
        res.clearCookie("authorization");
        req.token = {};
        return next();
    }
}