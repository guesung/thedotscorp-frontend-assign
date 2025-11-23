import { useEffect, useRef, type PropsWithChildren } from "react";
import { useModalContext } from "./ModalRoot";
import { useFocusTrap, getFocusableElements } from "../../hooks/useFocusTrap";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId, animation, isAnimating } =
    useModalContext();

  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // 포커스 트랩 (Tab 키 순환)
  useFocusTrap(contentRef);

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

  // 포커스 관리: 열릴 때 포커스 이동, 닫힐 때 복원
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const focusableElements = getFocusableElements(contentRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      contentRef.current?.focus();
    }

    return () => {
      previousActiveElementRef.current?.focus();
    };
  }, []);

  // body 스크롤 방지
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 배경 클릭 이벤트 전파 방지
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 애니메이션 클래스 생성
  const getAnimationClasses = () => {
    if (animation === "none") return "";

    const baseTransition = "transition-all duration-200 ease-out";

    if (animation === "fade") {
      const opacityState = isAnimating ? "opacity-100" : "opacity-0";
      const scaleState = isAnimating ? "scale-100" : "scale-95";
      return `${baseTransition} ${opacityState} ${scaleState}`;
    }

    if (animation === "slide") {
      const opacityState = isAnimating ? "opacity-100" : "opacity-0";
      const translateState = isAnimating ? "translate-y-0" : "-translate-y-4";
      return `${baseTransition} ${opacityState} ${translateState}`;
    }

    return "";
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
      onClick={handleContentClick}
    >
      {children}
    </div>
  );
}
