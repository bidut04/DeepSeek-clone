import { assets } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';

const ChatLabel = ({ openMenu, setOpenMenu }) => {
  return (
    <div className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer">
      {/* Chat Name (Truncated) */}
      <p className="truncate max-w-[80%]">Chat Name</p>

      {/* Options Menu */}
      <div
        className="relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg cursor-pointer"
        onClick={() => setOpenMenu(prev => ({ ...prev, open: !prev.open }))}
      >
        {/* Three Dots Icon */}
        <Image
          src={assets.three_dots}
          alt="More Options"
          className="w-4"
        />

        {/* Dropdown Menu */}
        <div className={`absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2 ${openMenu.open ? 'block' : 'hidden'}`}>
          {/* Rename Option */}
          <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.pencil_icon} alt="Edit" className="w-4" />
            <p>Rename</p>
          </div>
          {/* Delete Option */}
          <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
            <Image src={assets.delete_icon} alt="Delete" className="w-4" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
