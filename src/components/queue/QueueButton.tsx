import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const queueButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 font-semibold",
  {
    variants: {
      variant: {
        service: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105",
        counter: "bg-gradient-accent text-accent-foreground hover:shadow-queue",
        success: "bg-gradient-success text-success-foreground hover:shadow-glow",
        ticket: "bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        display: "bg-muted text-muted-foreground border border-border",
      },
      size: {
        service: "h-24 px-8 text-lg rounded-2xl",
        counter: "h-16 px-6 text-base rounded-xl",
        ticket: "h-32 px-8 text-2xl rounded-3xl",
        display: "h-20 px-6 text-xl rounded-xl",
      },
      pulse: {
        true: "animate-pulse-glow",
        false: "",
      }
    },
    defaultVariants: {
      variant: "service",
      size: "service",
      pulse: false,
    },
  }
);

export interface QueueButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof queueButtonVariants> {}

export const QueueButton = ({ 
  className, 
  variant, 
  size, 
  pulse,
  children, 
  ...props 
}: QueueButtonProps) => {
  return (
    <Button
      className={cn(queueButtonVariants({ variant, size, pulse }), className)}
      {...props}
    >
      {children}
    </Button>
  );
};