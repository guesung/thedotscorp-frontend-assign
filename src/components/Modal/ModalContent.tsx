import { useRef, type MouseEvent, type PropsWithChildren } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useKeyboardEvent } from "@/hooks/useKeyboardEvent";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalContext } from "./ModalRoot";
import { cn } from "@/lib/utils";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId, isAnimating } = useModalContext();

  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef);
  useKeyboardEvent("Escape", onClose);
  useBodyScrollLock();

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className={cn(
        "bg-white rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none transition-opacity duration-200 ease-out",
        isAnimating ? "opacity-100" : "opacity-0",
        className
      )}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
