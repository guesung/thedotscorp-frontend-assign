import type { PropsWithChildren } from "react";
import { useModalContext } from "./ModalRoot";

interface ModalBodyProps extends PropsWithChildren {
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  const { descriptionId } = useModalContext();

  return (
    <div id={descriptionId} className={className ?? "px-6 py-4"}>
      {children}
    </div>
  );
}
