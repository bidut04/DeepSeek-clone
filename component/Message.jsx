import { assets } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';

const Message = ({ role, content }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${role === 'user' ? 'items-end' : ''}`}>
        <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user' ? 'bg-[#414158] px-5' : 'gap-3'}`}>
          
          {/* Hover Icons (User) */}
          {role === 'user' && (
            <div className="opacity-0 group-hover:opacity-100 absolute -right-4 top-11 flex items-center gap-2 transition-all">
              <Image src={assets.copy_icon} alt="copy" className="w-4 cursor-pointer" />
              <Image src={assets.pencil_icon} alt="edit" className="w-4.5 cursor-pointer" />
            </div>
          )}

          {/* Hover Icons (Bot) */}
          {role !== 'user' && (
            <div className="opacity-0 group-hover:opacity-100 absolute left-9 -bottom-6 flex items-center gap-2 transition-all">
              <Image src={assets.copy_icon} alt="copy" className="w-4.5 cursor-pointer" />
              <Image src={assets.regenerate_icon} alt="regenerate" className="w-4 cursor-pointer" />
              <Image src={assets.like_icon} alt="like" className="w-4.5 cursor-pointer" />
              <Image src={assets.dislike_icon} alt="dislike" className="w-4.5 cursor-pointer" />
            </div>
          )}

          {/* Message Content */}
          {role === 'user' ? (
            <span className="text-white/90">{content}</span>
          ) : (
            <>
              <Image src={assets.logo_icon} alt="logo" className="h-9 w-9 p-1 border border-white/15 rounded-full" />
              <div className="space-y-4 w-full overflow-scroll">
                {content}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
