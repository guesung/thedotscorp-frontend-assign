import type { PropsWithChildren } from "react";
import { useModalContext } from "./ModalRoot";
import { cn } from "@/lib/utils";

interface ModalOverlayProps extends PropsWithChildren {
  closeOnClick?: boolean;
  className?: string;
}

export function ModalOverlay({
  children,
  closeOnClick = true,
  className,
}: ModalOverlayProps) {
  const { onClose, isAnimating } = useModalContext();

  const handleClick = () => {
    if (closeOnClick) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-overlay flex items-center justify-center z-modal transition-opacity duration ease-out",
        isAnimating ? "opacity-100" : "opacity-0",
        className
      )}
      onClick={handleClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
