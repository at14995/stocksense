import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-gray-700/60 bg-[#191C29] px-4 py-2.5 text-sm text-gray-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 focus:shadow-[0_0_10px_rgba(99,102,241,0.4)] focus:bg-[rgba(30,32,46,0.95)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-indigo-500/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
