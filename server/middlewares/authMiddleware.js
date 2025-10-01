const jwt = require("jsonwebtoken");
exports.authMiddleware = async(req,res,next) => {
    try {
        const {token} = req.cookies;
        if(!token) return res.status(401).json({success:false,message:"Token Not Found"});
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        console.log("Payload Data:- ",payload);
        if(!payload) return res.status(401).json({success:false,message:"Invalid Token"});
        req.user = payload;
        next();
        
    } catch (error) {
        console.error("Error In Auth Middleware",error);
        next(new Error(error));
        return;
    }
}