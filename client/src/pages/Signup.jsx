import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import toast from 'react-hot-toast';
import axiosInstance from "../axios/axiosInstance";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {useNavigate} from 'react-router-dom'

const avatars = [
  "https://api.dicebear.com/9.x/notionists/svg?seed=Felix",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Akarsh",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Ana",
  "https://api.dicebear.com/9.x/notionists/svg?seed=Eva",
  "https://api.dicebear.com/9.x/notionists/svg?seed="
];

function Signup({userDetails,setUserDetails}) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiCalled,setApicalled] = useState(false);
  const navigate = useNavigate()

const handleSuccess = async(response) => {
console.log("After Google Function Call",response);
try {
  const serverResponse = await axiosInstance.post('/signup/google',{token:response.credential});
  console.log("serverResponse",serverResponse);
  toast.success("Signup Successfull");
     const userDetails = {
          username:serverResponse.data.googleUser.name,
          email:serverResponse.data.googleUser.email,
          avatar:serverResponse.data.googleUser.picture
        }
  setUserDetails(userDetails);
  navigate('/room-info');

} catch (error) {
  console.error("Some Error Occuered While Google Signup",error);
  toast.error(error?.response?.data?.message||'Error While Google Signup');
}

}
const handleError = (error) => {
  console.log("Google Login Error",error);
}

  const handleSignup = async(event) => {
    event.preventDefault();
    if(!name || !email || !password || !selectedAvatar){
      toast.error("Please fill all the fields");
      return;
    }
    console.log("name",name,"email",email,"password",password,"avatar",selectedAvatar);
    try{
       setApicalled(true);
    const response = await axiosInstance.post("/send-otp", {name, email, password, avatar: selectedAvatar});
    console.log("response after sending otp",response);
    toast.success("Otp Sent Successfully");
    setApicalled(false);
    navigate('/verify-otp',{state:{email}});
    }catch(error){
      console.log("error",error.response.data.message);
      toast.error(error?.response?.data?.message||"Some Error Occuered");
      setApicalled(false);
      return;
    }
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Outer Card */}
      <div className="w-[90%] md:w-[70%] lg:w-[80%] h-[80%] mt-[8%] rounded-3xl flex shadow-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-2xl relative">
        
        {/* Left Section (Form) */}
        <div className="w-[60%] py-10 h-full flex flex-col justify-center items-center px-10 text-white relative z-10">
          <h2 className="text-4xl mt-12 font-extrabold text-transparent bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400 bg-clip-text mb-8 tracking-tight">
            Create Account ✨
          </h2>

          {/* Avatar Selector */}
          <div className="flex flex-row justify-center items-center gap-x-5 mb-8">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="avatar"
                onClick={() => setSelectedAvatar(avatar)}
                className={`h-20 w-20 rounded-full cursor-pointer transition-all border-2 ${
                  selectedAvatar === avatar
                    ? "border-fuchsia-500 scale-110 shadow-lg shadow-fuchsia-500/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <form className="w-full flex flex-col gap-5">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-zinc-800/60 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm placeholder-transparent"
                placeholder="Full Name"
              />
              <label className="absolute left-4 top-2.5 text-xs text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-fuchsia-400">
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-zinc-800/60 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm placeholder-transparent"
                placeholder="Email"
              />
              <label className="absolute left-4 top-2.5 text-xs text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-fuchsia-400">
                Email Address
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-zinc-800/60 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm placeholder-transparent"
                placeholder="Password"
              />
              <label className="absolute left-4 top-2.5 text-xs text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-400">
                Password
              </label>
            </div>

            <button
               onClick={handleSignup}
               disabled={apiCalled}
              type="submit"
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 font-semibold text-white shadow-lg hover:scale-[1.03] hover:shadow-fuchsia-500/30 transition-all"
            >
              {apiCalled ? "Sending otp..." : "Sign Up"}
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center w-full my-6 mb-2">
            <div className="flex-grow border-t border-zinc-700"></div>
            <span className="mx-3 text-zinc-400 text-sm">OR</span>
            <div className="flex-grow border-t border-zinc-700"></div>
          </div>

          {/* Google Button */}
   <GoogleOAuthProvider clientId="473982069419-f5f9bbme7v096lr2c3ibtrarma8q4g3u.apps.googleusercontent.com">
      <div>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </GoogleOAuthProvider>

          <p className="mt-6 text-sm text-zinc-400">
            Already have an account?{" "}
            <span className="text-fuchsia-400 cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block w-[40%] h-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 z-10"></div>
          <div className="w-full h-full bg-[url('https://i.pinimg.com/736x/78/46/15/7846157c6cd06cab3d80e92cc76a7287.jpg')] bg-no-repeat bg-center bg-cover" />
        </div>
      </div>
    </div>
  );
}

export default Signup;