import {
  createContext,
  useContext,
  useId,
  useState,
  useEffect,
  type PropsWithChildren,
} from "react";
import { ModalPortal } from "./ModalPortal";
import { ModalOverlay } from "./ModalOverlay";

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
  closeOnOverlayClick?: boolean;
  portalContainer?: Element | null;
}

export function ModalRoot({
  children,
  isOpen,
  onClose,
  animation = "fade",
  closeOnOverlayClick = true,
  portalContainer = document.body,
}: ModalRootProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
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
      <ModalPortal container={portalContainer}>
        <ModalOverlay closeOnClick={closeOnOverlayClick}>
          {children}
        </ModalOverlay>
      </ModalPortal>
    </ModalContext.Provider>
  );
}
