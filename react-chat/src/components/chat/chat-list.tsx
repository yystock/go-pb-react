import { useEffect, useRef, useState } from "react";
import { MessageItem } from "@/lib/types";
import { RandomAvatar } from "react-random-avatars";

export default function MessagesList({
  target,
  messages,
  sendMessage,
}: {
  target: string;
  messages: MessageItem[];
  sendMessage: (value: string) => void;
}) {
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const messagesGroupedBySender = messages.reduce(
    (prev, curr) => {
      if (prev.length > 0 && curr.sender === prev[prev.length - 1].sender) {
        prev[prev.length - 1].messages.push(curr.message);
        return prev;
      } else {
        return [
          ...prev,
          {
            sender: curr.sender,
            messages: [curr.message],
          },
        ];
      }
    },
    [] as { sender: string; messages: string[] }[]
  );

  const submit = () => {
    setMessage("");
    sendMessage(message);
    scrollToBottom();
  };

  return (
    <div className="flex-1 justify-between flex flex-col h-[700px] bg-secondary">
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-screen"
      >
        {messages.length > 0 ? (
          <>
            {messagesGroupedBySender.map((group, key) => (
              <div key={key} className="chat-message">
                <div className={`flex items-end${group.sender !== target ? "" : " justify-end"}`}>
                  <div
                    className={`flex flex-col space-y-2 text-md max-w-xs mx-2 ${
                      group.sender !== target ? "order-2 items-start" : "order-1 items-end"
                    }`}
                  >
                    {group.messages.map((message, key) => (
                      <div key={key}>
                        <span
                          className={`px-4 py-2 rounded-lg inline-block ${
                            group.sender === target ? "rounded-bl-none bg-primary text-primary-foreground" : "rounded-br-none bg-white text-black"
                          }`}
                        >
                          {message}
                        </span>
                      </div>
                    ))}
                  </div>
                  <RandomAvatar name={group.sender} size={32} />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </>
        ) : (
          <div className="chat-message flex justify-center">
            <span className="px-4 py-2 inline-block">No messages yet.</span>
          </div>
        )}
      </div>
      <div className="border-t-2 border-white  px-4 py-2 bg-primary">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center ">
            <button
              type="button"
              className="inline-flex items-center bg-white justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          </span>
          <input
            type="text"
            placeholder="Write Something"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? submit() : null)}
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-white rounded-full py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-primary border-white border-2 hover:bg-primary/60 focus:outline-none"
              onClick={() => submit()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 transform rotate-90">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
