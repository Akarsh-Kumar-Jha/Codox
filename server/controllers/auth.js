const connectRedis = require("../config/redisConnection");
const User = require("../models/User");
const otpGenerator = require('otp-generator');
const { sendMail } = require("../utils/mailSender");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 



exports.sendOtp = async(req,res) => {
    try {

        console.log("req.body",req.body);
        const {name,email,password,avatar} = req.body;
        if(!name || !email || !password || !avatar){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userFind = await User.findOne({email});
        if(userFind){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const redis = await connectRedis();
        const otpVal = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        await redis.setex(email, 300, {
            name,
            email,
            password,
            avatar,
            otp: otpVal
        });

        const mailResponse = await sendMail(email, "Otp to create account", `
            <body style="margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;background:#f9fafb;">
    <div style="max-width:500px;margin:0 auto;background:#fff;padding:20px;border-radius:8px;text-align:center;border:1px solid #e5e7eb;">
      <h2 style="margin:0 0 15px 0;color:#0f172a;">Codox Verification Code</h2>
      <p style="margin:0 0 20px 0;color:#334155;font-size:15px;">
        Use the code below to verify your account. It expires in <strong>5 minutes</strong>.
      </p>
      <div style="display:inline-block;padding:12px 20px;background:#0ea5e9;color:#fff;font-size:22px;font-weight:bold;letter-spacing:3px;border-radius:6px;">
       ${otpVal}
      </div>
      <p style="margin:20px 0 0 0;color:#64748b;font-size:13px;">
        If you didn’t request this, please ignore this email.
      </p>
    </div>
  </body>
            `);

        if(!mailResponse){
            return res.status(500).json({
                success: false,
                message: "Error in sending mail",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully",
            otp: otpVal
        });

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error.message
        });
    }
}

exports.verifyOtp = async(req,res) => {
    try {
        console.log("req.body",req.body);
        const {email,otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userFind = await User.findOne({email});
        if(userFind){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const redis = await connectRedis();
        const user = await redis.get(email);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Otp Expired!"
            });
        }
        console.log("user",user);
        // const userObj = await JSON.parse(user);
        // console.log("userObj",userObj);
        if(user.otp !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid Otp"
            });
        }

        const hashedPassword = await bcrypt.hash(user.password,10);

        const newUser = await User.create({
            username:user.name,
            email:user.email,
            avatar:user.avatar,
            password:hashedPassword
        });

        const payload = {
            id:newUser._id,
            email:newUser.email,
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
        await redis.del(email);

res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  secure: true,
  sameSite: "none",
});

        

        return res.status(200).json({
            success: true,
            message: "Otp verified successfully And Account Created Successfully",
            newUser,
            userFind,
            token
        });
}catch(error){
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:error.message
    });
}
}


exports.login = async(req,res) => {
    try {

        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const userFind = await User.findOne({email});
        if(!userFind){
            return res.status(400).json({
                success:false,
                message:"User not found with this email"
            });
        }
        const passwordMatch = await bcrypt.compare(password,userFind.password);
        if(!passwordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Password"
            });
        }
        const payload = {
            id:userFind._id,
            email:userFind.email,
            avatar:userFind.avatar
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
           res.cookie("token", token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  secure: true,
  sameSite: "none",
});

        return res.status(200).json({
            success:true,
            message:"Login Successfully",
            userFind,
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error:error.message
        });
    }
}

async function verifyGoogleToken(token){
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
}

exports.signupWithGoogle = async (req, res) => {
    try {

        const {token} = req.body;
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Google Token is required"
            });
        }
        const googleUser = await verifyGoogleToken(token);

        if(!googleUser){
            return res.status(400).json({
                success: false,
                message: "Invalid Google Token"
            });
        }

        const userDet = {
            username:googleUser.name,
            email:googleUser.email,
            avatar:googleUser.picture,
            password:Math.random().toString(36).slice(2)
        }

        const userFind = await User.findOne({email:userDet.email});
        if(userFind){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }


        const newUser = await User.create(userDet);
        console.log("newUser After Google Signup",newUser);

         const payload = {
        id:newUser._id,
        email:newUser.email,
        avatar:newUser.avatar
    }

        const jwtToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
        console.log("jwtToken After Google Signup",jwtToken);
        res.cookie("token", jwtToken, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  secure: true,
  sameSite: "none",
});

        return res.status(200).json({
            success: true,
            message: "Google signup successful",
            googleUser,
            token:jwtToken
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error.message
        })
    }
}


exports.googleLogin = async(req,res) => {
try {
    const {token} = req.body;
    if(!token){
        return res.status(400).json({
            success: false,
            message: "Google Token is required"
        });
    }

    const googleUser = await verifyGoogleToken(token);
    if(!googleUser){
        return res.status(400).json({
            success: false,
            message: "Invalid Google Token"
        });
    }


    console.log("All Data Given By Google",googleUser);

    const email = googleUser.email;
    const userDet = {
        username:googleUser.name,
        email:googleUser.email,
        avatar:googleUser.picture
    }

    const userFind = await User.findOne({email:email});
    if(!userFind){
        return res.status(400).json({
            success: false,
            message: "User not found with this email"
        });
    }
    console.log("userFind After Google Login",userFind);
    const payload = {
        id:userFind._id,
        email:userFind.email,
        avatar:userFind.avatar
    }

    const jwtToken = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token", jwtToken, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  secure: true,
  sameSite: "none",
});


    return res.status(200).json({
        success: true,
        message: "Google login successful",
        googleUser,
        token:jwtToken
    });
    
} catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error:error.message
    });
}
}

exports.getUserDet = async(req,res) => {
    try {
        console.log("req.body",req.body);
        const payload = req.user;
        console.log("payload In Controleer",payload);
        const userId = payload.id;
        const email = payload.email;
        const redis = await connectRedis()
        const userInRedis = await redis.get(email);
        if(userInRedis){
            return res.status(200).json({
                success: true,
                message: "User details fetched successfully",
                UserFind:userInRedis
            });
        }
        const UserFind = await User.findById(userId);
        if(!UserFind){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        await redis.setex(email, 400, UserFind);
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            UserFind
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:error.message
        });
    }
}