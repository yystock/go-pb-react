import React from "react";
import { Button } from "../ui/button";
import { RandomAvatar } from "react-random-avatars";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
export default function Sidebar({ me, members }: { me: string; members: string[] }) {
  return (
    <>
      <div className="flex-none rounded-l-lg w-20 md:w-40 bg-primary ">
        <div className="flex sm:items-center justify-center pt-16 px-5">
          <div className="text-lg invisible md:visible">
            <span className="mt-4 font-bold text-center text-muted">
              <User2 color="white" size={24} />
            </span>
          </div>
        </div>
        <div className="pt-8 flex flex-col px-2 space-y-2.5 overflow-y-scroll ">
          {members.map((member, key) => (
            <div key={key}>
              <Button className={cn("flex items-center p-3 rounded-xl gap-1 px-2 ")}>
                <RandomAvatar name={member} />
                <div className="flex items-center">
                  <span className={cn("mr-3 ml-2", me === member && "text-green-500")}>{member}</span>
                  <span className="text-green-500">
                    <svg width="10" height="10">
                      <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                    </svg>
                  </span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
