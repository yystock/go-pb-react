import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "../global.css";
import { PocketProvider } from "@/providers/PocketbaseProvider";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
export const Route = createRootRoute({
  component: () => (
    <>
      <PocketProvider>
        <Navigation />
        <hr />

        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </PocketProvider>
    </>
  ),
});
