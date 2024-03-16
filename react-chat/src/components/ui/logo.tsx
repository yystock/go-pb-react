import { cn } from "@/lib/utils";

export default function Logo({ small, icon, inline = true, className }: { small?: boolean; icon?: boolean; inline?: boolean; className?: string }) {
  return (
    <h3 className={cn("logo", inline && "inline", className)}>
      <strong>
        {icon ? (
          <img className="mx-auto w-9 dark:invert" alt="toppi" title="toppi" src={`/vite.svg`} />
        ) : (
          <img className={cn(small ? "h-4 w-auto" : "h-5 w-auto", "dark:invert")} alt="toppi" title="toppi" src={"/vite.svg"} />
        )}
      </strong>
    </h3>
  );
}
