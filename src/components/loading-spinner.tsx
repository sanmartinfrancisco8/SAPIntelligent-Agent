import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export const LoadingSpinner = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Loader
      style={{ width: size, height: size }}
      className={cn("animate-spin text-primary", className)}
    />
  );
};
