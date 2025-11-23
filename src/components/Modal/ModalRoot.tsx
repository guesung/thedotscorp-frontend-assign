import {
  createContext,
  useContext,
  useId,
  type PropsWithChildren,
} from "react";

interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
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
}

export function ModalRoot({ children, isOpen, onClose }: ModalRootProps) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onClose,
        titleId,
        descriptionId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
