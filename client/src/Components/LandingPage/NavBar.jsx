import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function NavBar({userDetails}) {
  console.log("In NavBar User Details",userDetails);
  const loacation = useLocation();
  if(loacation.pathname.includes('/editor/')){
    console.log("Disable");
  }
  return (
    <nav className={`w-11/12 mx-auto mt-3 px-6 py-3 
      flex items-center justify-between 
      rounded-2xl border border-white/20 ${loacation.pathname.includes('/editor/')?'hidden':'block'}
      bg-white/10 backdrop-blur-xl shadow-lg fixed top-5`}>
      
      {/* Logo */}
     <div className="flex items-center gap-2 bg-gradient-to-r from-[oklch(78.5% 0.115 274.713)] 
    to-[oklch(45.7% 0.24 277.023)]">
<h1 className="text-3xl font-extrabold bg-clip-text text-transparent 
  bg-gradient-to-r from-purple-500 to-pink-500 
  hover:from-pink-500 hover:to-yellow-500 transition-all duration-500">
  Codox
</h1>
</div>
      {/* Links */}
      <div className="hidden md:flex gap-8 text-lg font-medium text-white/80">
        <NavLink
          to='/'
          className={({isActive}) => isActive?'text-indigo-400':'text-white relative group'}
        >
          Home
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
        <NavLink to='/features' className={({isActive}) => isActive?'text-indigo-400':'text-white relative group'}>
          Features
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
       {!userDetails?.username && <NavLink to='/login' className={({isActive}) => isActive?'text-indigo-400':'text-white relative group'}>
          Login / Signup
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>}

           {userDetails?.username && <NavLink to='/room-info' className={({isActive}) => isActive?'text-indigo-400':'text-white relative group'}>
         Room
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-amber-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-3">
    {
         userDetails?.avatar && <img
          src={userDetails.avatar}
          alt="avatar"
          referrerPolicy="no-referrer"
          className="h-10 w-10 rounded-full border border-white/30 hover:scale-105 transition-transform"
        />
    }
      </div>
    </nav>
  );
}

export default NavBar;