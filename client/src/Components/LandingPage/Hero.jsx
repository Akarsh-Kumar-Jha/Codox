import React from 'react'
import { useNavigate } from 'react-router-dom'

function Hero({userDetails,setUserDetails}) {
  const navigate = useNavigate();
  return (
    <div className='max-w-11/12 flex flex-col relative'>
      
   <div className="relative flex flex-col items-center justify-center text-center px-6 py-20">

<div className='flex flex-col justify-center items-center gap-y-5'>
      {/* Heading */}
  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight
   text-blue-500/90 animate-fade-in [animation-delay:0.1s]
    drop-shadow-lg selection:text-white py-2">
    Codox — Because Coding <br /> <span className='text-white/90'>is Better Together.</span>
  </h2>

  {/* Subtext */}
  <p className="mt-6 text-lg md:text-xl font-medium tracking-tight 
    bg-clip-text text-transparent bg-gradient-to-b from-indigo-300 to-zinc-500 
    animate-fade-in [animation-delay:0.2s] max-w-2xl mx-auto selection:text-white">
    No more sending code snippets back and forth <br /> Codox
    brings everyone into one live editor where collaboration, learning, and productivity meet.
  </p>
</div>
</div>

<div className='mx-auto'>
    <button onClick={() => navigate('/room-info')} className='bg-transparent border-2 border-zinc-500 rounded-2xl px-5 py-3 relative overflow-hidden cursor-pointer group'>
         Start Coding Free 
         <span className='h-[1px] w-0 bg-gradient-to-r from-indigo-300 to-indigo-500 absolute bottom-0 left-0 rounded-2xl group-hover:w-full transition-all duration-300 ease-in-out'>

         </span>
    </button>
</div>
    </div>
  )
}

export default Hero