import { useCallback, useEffect, useRef, useState } from "react";
import { MessageItem } from "@/lib/types";
import Sidebar from "@/components/chat/chat-sidebar";
import MessagesList from "@/components/chat/chat-list";
import { usePocket } from "@/providers/PocketbaseProvider";
import ChatHeader from "./chat-header";
import { TopicsRecord, TopicsResponse, UsersResponse } from "@/lib/types/pocketbase-types";
import { toast } from "sonner";
import { useGuest } from "@/hooks/useGuest";

interface ChatComponentProps {
  topicId: string;
}
type key = {
  members: string;
};
type membersType = {
  user: UsersResponse;
};
export default function ChatComponent({ topicId }: ChatComponentProps) {
  const [members, setMembers] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const { pb, user } = usePocket();
  const { guest } = useGuest();

  const getAllMembers = useCallback(async () => {
    const record = await pb.collection("topics").getOne<TopicsResponse>(topicId, { expand: "members" });
    if (!record || !record.expand || !record.expand.members) return;

    setMembers(record.expand.members.map((x: any) => x.name));
    setTopic(record.name);
  }, []);

  const getAllMessages = useCallback(async () => {
    const allMessages = await pb.collection("messages").getFullList({
      filter: `topicId="${topicId}"`,
      expand: "userId",
    });

    setMessages(allMessages.map((x: any) => ({ message: x.content, sender: x.expand.userId.name })));
  }, []);

  const sendMessage = useCallback(async (value: string) => {
    if (!value) return;
    try {
      const insertedMessage = await pb.collection("messages").create({
        content: value,
        userId: user ? user.id : guest.id,
        topicId: topicId,
      });
      toast.success("Message sent");
    } catch (e) {
      toast.error("Error sending message");
    }
  }, []);

  useEffect(() => {
    getAllMembers();
    getAllMessages();
  }, []);

  useEffect(() => {
    // Subscribe to changes only in the specified record
    pb.collection("messages").subscribe(
      "*",
      function (e: any) {
        if (e.action === "create") {
          setMessages((prev) => [
            ...prev,
            {
              message: e.record.content,
              sender: e.record.expand.userId.name,
            },
          ]);
        }
      },
      {
        expand: "userId",
        filter: `topicId="${topicId}"`,
      }
      //
    );

    pb.collection("topics").subscribe(
      "*",
      function (e: any) {
        if (e.action === "update") {
          setMembers(e.record.expand.members.map((x: any) => x.name));
        }
      },
      {
        /* other options like expand, custom headers, etc. */
        filter: `id="${topicId}"`,
        expand: "members",
      }
    );

    return () => {
      pb.collection("messages").unsubscribe();
      pb.collection("topics").unsubscribe(); // remove all '*' topic subscriptions
    };
  }, []);

  return (
    <div className="flex w-full max-w-[1140px] rounded-md">
      <Sidebar me={user ? user.name || user.username : guest.name} members={members} />
      <div className="flex-auto border-r-4 rounded-r-md border-primary">
        <ChatHeader name={topic} />
        <MessagesList target={user ? user.name || user.username : guest.name} messages={messages} sendMessage={sendMessage} />
      </div>
    </div>
  );
}
