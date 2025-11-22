import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type PropsWithChildren,
  type RefObject,
} from "react";

type SelectVariant = "default" | "disabled";
interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value?: string;
  onChange?: (value: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  options: string[];
  registerOption: (value: string) => void;
  unregisterOption: (value: string) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxId: string;
  labelId: string;
  variant: SelectVariant;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select 컴포넌트 내부에서 사용해야 합니다.");
  }
  return context;
}

interface SelectRootProps extends PropsWithChildren {
  value?: string;
  onChange?: (value: string) => void;
  variant?: SelectVariant;
}

export function SelectRoot({
  children,
  value,
  onChange,
  variant = "default",
}: SelectRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const registerOption = useCallback((optionValue: string) => {
    setOptions((prev) =>
      prev.includes(optionValue) ? prev : [...prev, optionValue]
    );
  }, []);

  const unregisterOption = useCallback((optionValue: string) => {
    setOptions((prev) => prev.filter((v) => v !== optionValue));
  }, []);

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        setIsOpen,
        value,
        onChange,
        highlightedIndex,
        setHighlightedIndex,
        options,
        registerOption,
        unregisterOption,
        triggerRef,
        listboxId,
        labelId,
        variant,
      }}
    >
      <div className="relative w-64">{children}</div>
    </SelectContext.Provider>
  );
}
