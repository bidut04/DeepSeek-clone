import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import { useClerk, UserButton } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import ChatLabel from '@/component/ChatLable';

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user } = useAppContext();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <div 
      className={`flex flex-col bg-[#212327] pt-7 transition-all z-50 h-screen 
      max-md:absolute max-md:h-screen ${expand ? 'p-4 w-[256px]' : 'w-0 md:w-[96px] max-md:overflow-hidden'}`}
    >
      <div className="flex flex-col gap-6 flex-grow">
        {/* Logo + Toggle Button */}
        <div className={`flex ${expand ? 'flex-row gap-10' : 'flex-col items-center gap-8'}`}>
          <Image 
            src={expand ? assets.logo_text : assets.logo_icon} 
            alt="Logo" 
            className={expand ? 'w-36' : 'w-10'} 
            width={expand ? 144 : 40} 
            height={40}
          />

          {/* Toggle Button */}
          <div 
            onClick={() => setExpand(!expand)} 
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
          >
            <Image src={assets.menu_icon} alt="Menu" className="md:hidden" width={28} height={28} />
            <Image 
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} 
              alt="Sidebar Toggle" 
              className="hidden md:block w-7" 
              width={28} 
              height={28} 
            />

            {/* Hover Tooltip */}
            <div 
              className={`absolute w-max whitespace-nowrap opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none
              ${expand ? 'left-1/2 -translate-x-1/2 top-12' : '-top-12 left-0'}`}
            >
              {expand ? 'Close Sidebar' : 'Open Sidebar'}
            </div>
          </div>
        </div>

        {/* Chat Button */}
        <button 
          className={`self-start flex items-center justify-center cursor-pointer ${
            expand ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max" 
                   : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"
          }`}
        >
          <Image 
            className={expand ? 'w-6' : 'w-7'} 
            src={expand ? assets.chat_icon : assets.chat_icon_dull} 
            alt="Chat Icon" 
            width={28} 
            height={28} 
          />

          {/* Hover Tooltip */}
          {!expand && (
            <div className="absolute w-max -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg pointer-events-none">
              New Chat
            </div>
          )}

          {/* Chat Label (only visible when expanded) */}
          {expand && <p className="text-white font-medium">New Chat</p>}
        </button>

        {/* Recents Section */}
        {expand && (
          <div className="mt-8 text-white/25 text-sm">
            <p className="my-1">Recents</p>
            <ChatLabel openMenu={openMenu} setOpenMenu={setOpenMenu} />
          </div>
        )}
      </div>

      {/* Bottom Section (Get App & My Profile) */}
      <div className="mt-auto flex flex-col gap-3">
        {/* Get App Section - Fixed QR Code Hover */}
        <div 
          className={`relative flex items-center group cursor-pointer ${
            expand ? "gap-2 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10" 
                   : "h-10 mx-auto hover:bg-gray-500/30 rounded-lg"
          }`}
        >
          <Image 
            className={expand ? "w-5" : "w-[26px] mx-auto"} 
            src={expand ? assets.phone_icon : assets.phone_icon_dull} 
            alt="Phone Icon"
            width={expand ? 20 : 26}
            height={expand ? 20 : 26}
          />

          {/* QR Code Tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-52 opacity-0 group-hover:opacity-100 transition">
            <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
              <Image src={assets.qrcode} className="w-44" alt="QR Code" width={176} height={176} />
              <p className="text-center">Scan to get Deepseek App</p>
              <div className="w-3 h-3 absolute bg-black rotate-45 bottom-0 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          {/* Get App Text (Only Visible When Expanded) */}
          {expand && (
            <span className="flex items-center gap-1">
              Get App
              <Image src={assets.new_icon} alt="New" width={16} height={16} />
            </span>
          )}
        </div>

        {/* My Profile Section - Always at Bottom */}
        <div
          className={`flex items-center ${
            expand ? 'hover:bg-white/10 rounded-lg p-2' : 'justify-center w-full h-10'
          } cursor-pointer text-white/60 text-sm`}
          onClick={!user ? openSignIn : undefined} // Only trigger sign-in if no user
        >
          {user ? (
            <UserButton /> // Show Clerk's user profile button when logged in
          ) : (
            <Image src={assets.profile_icon} className="w-7" alt="Profile Icon" width={28} height={28} />
          )}
          {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
