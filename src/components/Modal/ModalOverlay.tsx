import type { PropsWithChildren } from "react";
import { useModalContext } from "./ModalRoot";

interface ModalOverlayProps extends PropsWithChildren {
  closeOnClick?: boolean;
  className?: string;
}

export function ModalOverlay({
  children,
  closeOnClick = true,
  className,
}: ModalOverlayProps) {
  const { onClose } = useModalContext();

  const handleClick = () => {
    if (closeOnClick) {
      onClose();
    }
  };

  return (
    <div
      className={
        className ??
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      }
      onClick={handleClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
