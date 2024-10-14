import React from "react";
import Image from "next/image";
import whatsappIcon from "@/public/icons/icons-whatsapp.gif";

const WhatsappButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
    <a
    href="https://wa.me/11954665200"
    className="cursor-pointer"
    >

    <div className="relative w-20 h-20 md:w-20 md:h-20">
        <Image
          //src={whatsappIcon}
          src="/icones/icone-animation.gif"
          alt="WhatsApp"
          layout="fill"
          className="object-contain"
        />
      </div>

    </a>
      
    </div>
  );
};

export default WhatsappButton;
