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
  const { onClose, animation, isAnimating } = useModalContext();

  const handleClick = () => {
    if (closeOnClick) {
      onClose();
    }
  };

  // 애니메이션 클래스 생성
  const getAnimationClasses = () => {
    if (animation === "none") return "";

    const baseTransition = "transition-opacity duration-200 ease-out";
    const opacityState = isAnimating ? "opacity-100" : "opacity-0";

    return `${baseTransition} ${opacityState}`;
  };

  return (
    <div
      className={
        className ??
        `fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${getAnimationClasses()}`
      }
      onClick={handleClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
