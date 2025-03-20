'use client';
import { assets } from "@/assets/assets";
import Sidebar from "@/component/Sidebar";
import PromptBox from "@/component/PromptBox";
import Image from "next/image";
import { useState } from "react";
import Message from "@/component/Message";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messege, setMessege] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="flex h-screen">
       {/* sidebar */}
       <Sidebar expand={expand}setExpand={setExpand}/>
       <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative ">
        <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full" >
          <Image onClick={()=>setExpand(!expand)} className="rotate-180" src={assets.menu_icon} alt=""/>
          <Image className="opacity-70" src={assets.chat_icon} alt=""/>

        </div>
        {
          messege.length===0?(
            <>
            <div className="flex items-center gap-3">
              <Image src={assets.logo_icon} className="h-16"/>
              <p className="text-2xl font-medium"> Hi, I'm deepSeek.</p>
            </div>
            <p className="text-sm mt-2">How Can I help you tiday?</p>
            </>
          ):
          (
            <div>

<Message role='user'content="what is next js "/>
            </div>
          )
        }
        {/* pormpt box */}
        <PromptBox isLoading={isLoading}setIsLoading={setIsLoading}/>
        <p className="absolute text-xs bottom-1 text-gray-500"> AI -genarated, for reference only</p>
       </div>
      </div>
    </div>
  );
}
