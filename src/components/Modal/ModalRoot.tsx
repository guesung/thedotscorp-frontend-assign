import {
  createContext,
  useContext,
  useId,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";

type ModalAnimation = "fade" | "slide" | "none";

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
  animation: ModalAnimation;
  isAnimating: boolean;
}

const ModalContext = createContext<ModalContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal 컴포넌트 내부에서 사용해야 합니다.");
  }
  return context;
}

interface ModalRootProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  animation?: ModalAnimation;
}

export function ModalRoot({
  children,
  isOpen,
  onClose,
  animation = "fade",
}: ModalRootProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  // 애니메이션 상태 관리
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // 다음 프레임에서 애니메이션 시작
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      // 애니메이션 종료 후 언마운트
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // 애니메이션 duration과 일치
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onClose,
        titleId,
        descriptionId,
        animation,
        isAnimating,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
