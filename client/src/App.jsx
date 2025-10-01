import React, { useEffect, useState } from 'react'
import NavBar from './Components/LandingPage/NavBar';
import Hero from './Components/LandingPage/Hero';
import Features from './pages/Features';
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Editor from './pages/Editor';
import RoomInfo from './pages/RoomInfo';
import axiosInstance from './axios/axiosInstance';
export default function App() {
  const [userDetails, setUserDetails] = useState({});

useEffect(() => {
async function fetchUser(){
try {
  const userDetails = await axiosInstance.post('/get-user');
  console.log("userDetails In App.jsx",userDetails.data);
setUserDetails(userDetails.data.UserFind);
localStorage.setItem('user-avatar', userDetails.data.UserFind.avatar);
} catch (error) {
  console.error("Error In Fetch User",error)
}
}
fetchUser();
},[]);

  return (
    <div className="min-h-screen bg-gray-900
 text-white flex flex-col items-center justify-center px-6 relative inset-0 z-0"
     style={{
      background: "#000000",
      backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }}
 >

  
  <NavBar userDetails={userDetails} />

  <Routes>
    <Route path='/' element={<Hero userDetails={userDetails} setUserDetails={setUserDetails} />} />
    <Route path='/features' element={<Features />} />
    <Route path='/login' element={<Login setUserDetails={setUserDetails}/>} />
    <Route path='/signup' element={<Signup userDetails={userDetails} setUserDetails={setUserDetails} />} />
    <Route path='/editor/:roomId' element={<Editor userDetails={userDetails}/>} />
    <Route path='/room-info' element={<RoomInfo/>} />
  </Routes>

    </div>
  );
}