import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function VerifyOtp({setUserDetails}) {
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const email = useNavigate().location.state.email
  console.log("email",email);

  const handleChange = (event, index) => {
    const value = event.target.value.replace(/\D/, ""); // only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index + 1 < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index >= 1) {
      inputRefs.current[index - 1].focus();
    }
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (otp.includes("")) {
      toast.error("Otp must be of 5 digits");
      return;
    }
    const finalOtp = otp.join("");
    console.log("finalOtp", finalOtp);

    setOtp(new Array(5).fill(""));
    inputRefs.current[0].focus();
    try {
        const response = axiosInstance.post("/verify-otp", {email,otp:finalOtp});
        console.log("response after sending otp",response);
            const userDetails = {
          username:response.data.userFind.username,
          email:response.data.userFind.email,
          avatar:response.data.userFind.avatar
        }
        setUserDetails(userDetails);
        navigate('/room-info');
         toast.success("Otp Verified Successfully");
    } catch (error) {
         console.error("Error In Signup",error.response.data.message);
        toast.error(error?.response?.data?.message||'Error While Signup');
        return;
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Verify OTP
        </h2>ost

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((item, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={item}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-2xl text-center font-semibold rounded-2xl 
                         border border-gray-600 bg-white/10 text-white 
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400
                         transition-all duration-200"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 
                     text-white font-semibold text-lg shadow-lg hover:scale-105 
                     hover:shadow-xl transition-all duration-300"
        >
          Submit OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;