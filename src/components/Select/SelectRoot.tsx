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
  isOpen: boolean; // DropDown 열림 여부
  setIsOpen: (open: boolean) => void;
  value?: string; // 선택된 값
  onChange?: (value: string) => void;
  highlightedIndex: number; // 하이라이트된 옵션 인덱스
  setHighlightedIndex: (index: number) => void;
  options: string[]; // 옵션 목록
  disabledOptions: Set<string>; // 비활성화된 옵션 목록
  registerOption: (value: string, disabled?: boolean) => void;
  unregisterOption: (value: string) => void;
  isOptionDisabled: (value: string) => boolean; // 옵션이 비활성화되었는지 확인
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxId: string; // 리스트 박스(Popup) ID
  labelId: string; // 라벨 ID
  variant: SelectVariant; // 변경 가능한 버전 (default, disabled)
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
  const [disabledOptions, setDisabledOptions] = useState<Set<string>>(
    new Set()
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const registerOption = useCallback(
    (optionValue: string, disabled?: boolean) => {
      setOptions((prev) =>
        prev.includes(optionValue) ? prev : [...prev, optionValue]
      );
      if (disabled) {
        setDisabledOptions((prev) => new Set(prev).add(optionValue));
      }
    },
    []
  );

  const unregisterOption = useCallback((optionValue: string) => {
    setOptions((prev) => prev.filter((v) => v !== optionValue));
    setDisabledOptions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(optionValue);
      return newSet;
    });
  }, []);

  const isOptionDisabled = useCallback(
    (optionValue: string) => disabledOptions.has(optionValue),
    [disabledOptions]
  );

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
        disabledOptions,
        registerOption,
        unregisterOption,
        isOptionDisabled,
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
