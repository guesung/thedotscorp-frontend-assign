import type { ButtonHTMLAttributes } from "react";
import { useModalContext } from "./ModalRoot";
import { CloseIcon } from "../icons/close";

interface ModalCloseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ModalCloseButton({
  children,
  className,
  ...props
}: ModalCloseButtonProps) {
  const { onClose } = useModalContext();

  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="닫기"
      className={
        className ??
        "absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
      }
      {...props}
    >
      {children ?? <CloseIcon />}
    </button>
  );
}
