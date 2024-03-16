import { cn } from "@/lib/utils";
import { forwardRef, useCallback, useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff } from "lucide-react";

export const EmailField = forwardRef<HTMLInputElement, InputProps>(function EmailField(props, ref) {
  return <Input ref={ref} type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" inputMode="email" {...props} />;
});

export const PasswordField = forwardRef<HTMLInputElement, InputProps>(function PasswordField(props, ref) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleIsPasswordVisible = useCallback(() => setIsPasswordVisible(!isPasswordVisible), [isPasswordVisible, setIsPasswordVisible]);
  const textLabel = isPasswordVisible ? "hide_password" : "show_password";

  return (
    <TooltipProvider>
      <Tooltip>
        <div className="group bg-background relative mb-1 flex items-center rounded-md  focus-within:ring-offset-background  focus-within:outline-none focus-within:ring-[3px]  focus-within:ring-black focus-within:ring-offset-0 ">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder={props.placeholder || "•••••••••••••"}
            ref={ref}
            {...props}
            className={cn(
              "flex h-10 w-full  px-3 py-2 text-sm border border-input ring-offset-background rounded-md focus-visible:outline-none   placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 mb-0 pr-10 border-r-0 rounded-r-none",
              props.className
            )}
          />

          <TooltipTrigger type="button" className="rounded-r-md border  h-10 p-2 " tabIndex={-1} onClick={toggleIsPasswordVisible}>
            {isPasswordVisible ? <EyeOff className="h-4 stroke-[2.5px]" /> : <Eye className="h-4 stroke-[2.5px]" />}

            <span className="sr-only">{textLabel}</span>
          </TooltipTrigger>
          <TooltipContent>{textLabel}</TooltipContent>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
});
