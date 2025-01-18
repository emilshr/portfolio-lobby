import * as React from "react";

import { cn } from "@/lib/utils";

type Props = {
  error?: boolean;
  errorMessage?: string;
};

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & Props
>(({ className, type, error = false, errorMessage, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-y-1">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:selection:bg-white-glass-20",
          className,
          error ? "ring-1 ring-red-400" : ""
        )}
        ref={ref}
        {...props}
      />
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
