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

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
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
  closeOnOverlayClick?: boolean;
  portalContainer?: Element | null;
}

export function ModalRoot({
  children,
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  portalContainer = document.body,
}: ModalRootProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const [shouldRender, setShouldRender] = useState(isOpen); // 모달을 렌더링 할지 여부
  const [isAnimating, setIsAnimating] = useState(false); // 모달을 애니메이션 중인지 여부

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
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
