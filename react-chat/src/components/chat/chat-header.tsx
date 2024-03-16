import React from "react";
import { RandomAvatar } from "react-random-avatars";

export default function ChatHeader({ name }: { name: string }) {
  return (
    <div className="flex justify-center py-4  bg-primary ">
      <div className="flex items-center px-8 gap-4">
        <RandomAvatar name={name} size={24} />

        <div className="text-xl flex items-center">
          <span className="text-primary-foreground mr-3">{name}</span>
        </div>
      </div>
    </div>
  );
}
