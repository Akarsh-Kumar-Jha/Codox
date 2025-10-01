import React from "react";

function ConnectedClients({username,id,avatar}) {
    console.log("username",username);
    const avatarImage = avatar
    console.log("avatarImage",avatarImage);
  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      <div className="h-[70px] w-[70px] bg-green-400 rounded-full shadow-2xl object-fill flex justify-center items-center">
        <img
          className="h-[100%] w-[100%]"
          src={avatarImage}
          alt="user-avatar"
          referrerPolicy="no-referrer"
        />
      </div>
      <h2 className="text-lg">{username}</h2>
    </div>
  );
}

export default ConnectedClients;
