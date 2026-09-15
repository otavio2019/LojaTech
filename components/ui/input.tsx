import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400", className)} {...props} />;
}
