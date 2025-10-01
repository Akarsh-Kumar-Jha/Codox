import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import toast from "react-hot-toast";

function Login({setUserDetails}) {
  console.log("SetUserDetails",setUserDetails);
    const navigate = useNavigate();
    const avatars = [];
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');



    const handleSubmit = async(e) => {
      if(!email.trim() || !password.trim()) return;
      console.log("Form Data : ",email,password);
      e.preventDefault();
      try {
        const response = await axiosInstance.post('/login',{
email,password
        });
        console.log("Login Response",response.data);
        toast.success("Login Successfull");
        const userDetails = {
          username:response.data.userFind.username,
          email:response.data.userFind.email,
          avatar:response.data.userFind.avatar
        }
        setUserDetails(userDetails);
        navigate('/room-info');
      } catch (error) {
        console.error("Error In Login",error.response.data.message);
        toast.error(error?.response?.data?.message||'Error While Login');
        return;
      }
    }

    const handleSuccess = async(response) => {
      console.log("Google Login Function Called ...");
      console.log("Google Login Response",response);
      try {
        const serverResponse = await axiosInstance.post('/login/google',{token:response.credential});
        const userDetails = {
          username:serverResponse.data.googleUser.name,
          email:serverResponse.data.googleUser.email,
          avatar:serverResponse.data.googleUser.picture
        }
        console.log("serverResponse",userDetails);
        setUserDetails(userDetails);
        toast.success("Login Successfull");
        navigate('/room-info');
  
      } catch (error) {
        console.error("Some Error Occuered While Google Login",error);
        toast.error(error?.response?.data?.message||'Error While Google Login');
      }
    }


    const handleError = (error) => {
      console.log("Google Login Error",error);
      toast.error(error?.response?.data?.message||'Error While Google Login');
      return;
    }
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Outer Card */}
      <div className="w-[90%] md:w-[70%] lg:w-[80%] h-[70%] mt-[7%] rounded-3xl flex shadow-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-2xl relative">
        
        {/* Left Section (Form) */}
        <div className="w-[60%] h-full flex flex-col justify-center items-center px-10 text-white relative z-10">
          <h2 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400 bg-clip-text mb-8 tracking-tight">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-zinc-800/60 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm placeholder-transparent"
                placeholder="Email"
              />
              <label className="absolute left-4 top-2.5 text-xs text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-fuchsia-400">
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-zinc-800/60 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm placeholder-transparent"
                placeholder="Password"
              />
              <label className="absolute left-4 top-2.5 text-xs text-zinc-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-zinc-500 peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-400">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 font-semibold text-white shadow-lg hover:scale-[1.03] hover:shadow-fuchsia-500/30 transition-all"
            >
              Login
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center w-full my-6">
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
            Don’t have an account?{" "}
            <span onClick={() => navigate('/signup')} className="text-fuchsia-400 cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block w-[40%] h-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 z-10"></div>
          <div className="w-full h-full bg-[url('https://i.pinimg.com/736x/df/4e/b9/df4eb97d64ef5948324db3e220533d3f.jpg')] bg-no-repeat bg-center bg-cover" />
        </div>
      </div>
    </div>
  );
}

export default Login;