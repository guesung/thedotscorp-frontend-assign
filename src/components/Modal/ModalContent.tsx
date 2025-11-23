import {
  useEffect,
  useRef,
  useCallback,
  type PropsWithChildren,
} from "react";
import { useModalContext } from "./ModalRoot";

interface ModalContentProps extends PropsWithChildren {
  className?: string;
}

// 포커스 가능한 요소 셀렉터
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function ModalContent({ children, className }: ModalContentProps) {
  const { onClose, titleId, descriptionId, animation, isAnimating } =
    useModalContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // 포커스 가능한 요소들 가져오기
  const getFocusableElements = useCallback(() => {
    if (!contentRef.current) return [];
    return Array.from(
      contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
  }, []);

  // ESC 키로 닫기 + Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus Trap: Tab 키 순환
      if (e.key === "Tab") {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: 뒤로 이동
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: 앞으로 이동
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, getFocusableElements]);

  // 포커스 관리: 모달 열릴 때 포커스 이동, 닫힐 때 복원
  useEffect(() => {
    // 이전 포커스 요소 저장
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // 모달 내 첫 번째 포커스 가능한 요소로 포커스 이동
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      contentRef.current?.focus();
    }

    // body 스크롤 방지
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // 포커스 복원
      previousActiveElementRef.current?.focus();
      // 스크롤 복원
      document.body.style.overflow = originalOverflow;
    };
  }, [getFocusableElements]);

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
