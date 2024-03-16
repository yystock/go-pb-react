import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pocketbase";

export default function Logout() {
  const logout = () => {
    pb.authStore.clear();
  };
  return (
    <Button onClick={logout} size={"sm"}>
      Logout
    </Button>
  );
}
