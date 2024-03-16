import { useMemo, useState } from "react";
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from "unique-names-generator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { usePocket } from "@/providers/PocketbaseProvider";
import { toast } from "sonner";
import { RecordModel } from "pocketbase";
import { useGuest } from "@/hooks/useGuest";

interface WelcomeProps {
  setIsMember: (value: boolean) => void;
  topic: RecordModel;
}

export default function Welcome({ setIsMember, topic }: WelcomeProps) {
  const { pb, user } = usePocket();
  const { setGuest, guest } = useGuest();
  const randomName = useMemo(() => {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }); // big_red_donkey
  }, []);
  const [nicknameValue, setNicknameValue] = useState(randomName);

  const joinTopic = async () => {
    if (nicknameValue === "") {
      toast.error("nickname cannot be empty");
      return;
    }
    try {
      if (user) {
        const req = await pb.send("/api/jointopic", { method: "PUT", body: JSON.stringify({ topicId: topic.id }) });
        // const res = await pb.collection("topics").update(topic.id, { members: [...topic.members, user.id] });
      }

      if (!user && !guest.id) {
        const insertRandomUser = await pb.collection("users").create({ password: "12345678", passwordConfirm: "12345678", name: nicknameValue });

        //const req = await pb.send("/api/jointopic", { method: "PUT", body: JSON.stringify({ topicId: topic.id }) });
        const res = await pb.collection("topics").update(topic.id, { members: [...topic.members, insertRandomUser.id] });

        setGuest(insertRandomUser.id, insertRandomUser.name);
      }
      setIsMember(true);

      toast.success("joined topic");
    } catch (e) {
      toast.error("Error joining topic");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-primary rounded p-6 space-y-4">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-primary-foreground">Join the Chat</h2>
        </div>
        <div className="space-y-1.5">
          <Label className="text-primary-foreground text-md">Username:</Label>
          <Input className={`w-full p-4 focus:outline-none`} type="text" value={nicknameValue} onChange={(e) => setNicknameValue(e.target.value)} />
        </div>
        <div className="pt-4">
          <Button variant={"outline"} size={"sm"} onClick={joinTopic} className="w-full py-3 font-bold transition duration-200">
            Join
          </Button>
        </div>
      </div>
    </section>
  );
}
