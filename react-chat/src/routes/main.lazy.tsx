import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePocket } from "@/providers/PocketbaseProvider";
import { Separator } from "@/components/ui/separator";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createLazyFileRoute("/main")({
  component: Main,
});

const topicSchema = z.object({
  name: z.string().min(1),
});

function Main() {
  const { pb } = usePocket();
  const navigate = useNavigate();
  const [topicId, setTopicId] = useState("");
  const [name, setName] = useState("");

  const createTopic = async () => {
    const safeName = topicSchema.safeParse({ name });
    if (!safeName.success) {
      toast.error("Invalid topic name");
      return;
    }

    try {
      const record = await pb.collection("topics").create({
        name: safeName.data.name,
      });
      setName("");
      setTopicId("");
      toast.success("Topic created");
      navigate({ to: `/topics/$topicId`, params: { topicId: record.id } });
    } catch (e) {
      toast.error("Error creating topic");
    }
  };

  const joinTopic = async () => {
    if (!topicId) return;
    try {
      const record = await pb.collection("topics").getOne(topicId);
      toast.success("Topic joined");
      setName("");
      setTopicId("");
      navigate({ to: `/topics/$topicId`, params: { topicId: topicId } });
    } catch (e) {
      toast.error("Error joining topic");
    }
  };

  return (
    <div className="flex gap-16 max-w-[1240px] justify-center mx-auto items-center mt-4">
      <div className="flex-1 flex flex-col ">
        <div className="mb-4">
          <Label className="text-md mb-1.5">Name</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button onClick={createTopic}>Create Topi</Button>
      </div>
      <Separator orientation="vertical" className="border-2 h-16" />
      <div className="flex flex-col flex-1">
        <div className="mb-4">
          <Label className="text-md mb-1.5">Topic ID</Label>
          <Input type="text" value={topicId} onChange={(e) => setTopicId(e.target.value)} />
        </div>

        <Button onClick={joinTopic}>Join Topi</Button>
      </div>
    </div>
  );
}
