import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from "../axios/axiosInstance";

function RoomInfo() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  async function fetchUser(){
  try {
      const userDetails = await axiosInstance.post('/get-user');
      console.log("userDetails In RoomInfo",userDetails.data.UserFind);
      setUsername(userDetails.data.UserFind.username);
      if(!userDetails?.data?.UserFind){
        navigate('/login');
        toast.error('Please Login First');
        return;
      }
  } catch (error) {
      console.error("Error In Fetch User",error)
      navigate('/login');
      toast.error('Please Login First');
  }
  }
  fetchUser();
  },[]);


  const handleRoomId = () => {
    const newRoomId = uuidv4();
    console.log('New Room ID:', newRoomId);
    setRoomId(newRoomId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Joining room with:", { roomId, username });
    if (!roomId || !username) {
        alert("Please fill in both fields.");
        return;
    }
    navigate(`/editor/${roomId}`, { state: { username } });

  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-4">
      
      <div className="w-full max-w-md bg-zinc-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <h2 className="text-3xl font-bold text-center text-white/90 mb-8 tracking-tight">
          Join a Room
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          
          <div className="flex flex-col gap-y-2">
            <label htmlFor="roomId" className="text-sm font-medium text-slate-400">
              Room ID
            </label>
            <input
              id="roomId"
              name="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 outline-none transition-all duration-300 ease-in-out
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter Room ID"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-400">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              readOnly
              className="px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 outline-none transition-all duration-300 ease-in-out
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter your username"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg mt-4
                       transition-all duration-300 ease-in-out
                       hover:bg-green-500
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500
                       active:scale-95"
          >
            Join
          </button>

        </form>
         <p className="underline text-sm text-blue-400 cursor-pointer mt-5" onClick={handleRoomId}>
          Having no room ID? Generate one
          </p>
      </div>
    </div>
  );
}

export default RoomInfo;