import {
  useEffect,
  useRef,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useKeyboardEvent } from "../../hooks/useKeyboardEvent";
import { useModalContext } from "./ModalRoot";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId, isAnimating } = useModalContext();

  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef);
  useKeyboardEvent("Escape", onClose);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const getAnimationClasses = () => {
    const baseTransition = "transition-opacity duration-200 ease-out";
    const opacityState = isAnimating ? "opacity-100" : "opacity-0";
    return `${baseTransition} ${opacityState}`;
  };

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      tabIndex={-1}
      className={
        className ??
        `bg-white rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none ${getAnimationClasses()}`
      }
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}
