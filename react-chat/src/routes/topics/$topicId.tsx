import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePocket } from "@/providers/PocketbaseProvider";
import { toast } from "sonner";
import ChatComponent from "@/components/chat/chat";
import Welcome from "@/components/chat/welcome";
import { RecordModel } from "pocketbase";
import { useGuest } from "@/hooks/useGuest";

export const Route = createFileRoute("/topics/$topicId")({
  component: Topic,
});

function Topic() {
  const { topicId } = Route.useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<RecordModel | null>(null);
  const { pb, user } = usePocket();
  const [isMember, setIsMember] = useState(false);
  const { guest } = useGuest();

  const validateMember = useCallback(async () => {
    const record = await pb.collection("topics").getOne(topicId);
    if (!record) {
      toast.error("Topic not found");
      navigate({ to: "/main" });
    }
    setTopic(record);
    if (!user && !guest.id) return;
    if (user) {
      if (!record.members || !record.members.find((x: any) => x === user.id)) {
        return;
      }
    }

    if (guest.id) {
      if (!record.members || !record.members.find((x: any) => x === guest.id)) {
        return;
      }
    }
    setIsMember(true);
  }, []);

  useEffect(() => {
    validateMember();
  }, []);

  if (!topic) return null;
  return (
    <>
      {isMember ? (
        <div className="flex justify-center">
          <ChatComponent topicId={topicId} />
        </div>
      ) : (
        <>
          <Welcome setIsMember={setIsMember} topic={topic} />
        </>
      )}
    </>
  );
}
