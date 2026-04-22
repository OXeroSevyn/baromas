import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1 rounded-md border border-border bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50",
        className,
      )}
    />
  );
}
