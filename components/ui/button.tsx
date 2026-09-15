import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300", className)} {...props} />;
}
