import { createFileRoute } from "@tanstack/react-router";

type CallBackUrl = {
  callbackUrl?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): CallBackUrl => {
    // validate and parse the search params into a typed state
    return {
      callbackUrl: (search.callbackUrl as string) || "",
    };
  },
});
