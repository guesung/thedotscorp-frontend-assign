import { useEffect, useRef, type PropsWithChildren } from "react";
import { useModalContext } from "./ModalRoot";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId } = useModalContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 포커스 트랩: 모달 열릴 때 포커스 이동
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;
    contentRef.current?.focus();

    return () => {
      previousActiveElement?.focus();
    };
  }, []);

  // 배경 클릭 이벤트 전파 방지
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        "bg-white rounded-lg shadow-xl max-w-md w-full mx-4 focus:outline-none"
      }
      onClick={handleContentClick}
    >
      {children}
    </div>
  );
}
