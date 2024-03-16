import { Link } from "@tanstack/react-router";
import Logout from "@/components/logout";
import { usePocket } from "@/providers/PocketbaseProvider";

export default function Navigation() {
  const { user } = usePocket();

  return (
    <div className="p-2 flex gap-4 items-center justify-center">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/main" className="[&.active]:font-bold">
        Main
      </Link>
      {user ? (
        <Logout />
      ) : (
        <Link to="/login" search={{}} className="[&.active]:font-bold">
          Login
        </Link>
      )}
    </div>
  );
}
