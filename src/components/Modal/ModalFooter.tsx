import type { PropsWithChildren } from "react";

interface ModalFooterProps extends PropsWithChildren {
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <footer
      className={
        className ?? "px-6 py-4 border-t border-gray-200 flex justify-end gap-2"
      }
    >
      {children}
    </footer>
  );
}
