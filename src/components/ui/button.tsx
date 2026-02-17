import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_hsla(72,100%,50%,0.4)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_30px_hsla(342,100%,58%,0.4)]",
        outline:
          "border border-foreground/20 bg-transparent text-foreground hover:border-primary hover:text-primary hover:shadow-[0_0_20px_hsla(72,100%,50%,0.2)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: 
          "text-foreground/60 hover:text-foreground hover:bg-transparent",
        link: 
          "text-primary underline-offset-4 hover:underline",
        // CRESTOX Special Variants
        hero:
          "bg-primary text-primary-foreground skew-x-[-10deg] hover:bg-foreground hover:text-background hover:shadow-[0_0_40px_hsla(72,100%,50%,0.5)] [&>*]:skew-x-[10deg]",
        pulse:
          "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground animate-pulse-glow",
        void:
          "bg-background/50 backdrop-blur-sm border border-foreground/10 text-foreground hover:border-primary hover:text-primary",
        data:
          "bg-card text-foreground font-mono text-xs tracking-widest hover:bg-card/80 border border-border",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
