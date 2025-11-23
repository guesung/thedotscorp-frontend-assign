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

interface SelectOption {
  value: string;
  label: string;
  disabled: boolean;
}

interface SelectContextValue {
  isOpen: boolean; // DropDown 열림 여부
  setIsOpen: (open: boolean) => void;
  value?: string; // 선택된 값
  onChange?: (value: string) => void;
  highlightedIndex: number; // 하이라이트된 옵션 인덱스
  setHighlightedIndex: (index: number) => void;
  options: SelectOption[]; // 옵션 목록
  registerOption: (value: string, label: string, disabled?: boolean) => void;
  isOptionDisabled: (value: string) => boolean; // 옵션이 비활성화되었는지 확인
  getSelectedLabel: () => string | undefined; // 선택된 옵션의 라벨 반환
  triggerRef: RefObject<HTMLButtonElement | null>;
  listboxId: string; // 리스트 박스(Popup) ID
  labelId: string; // 라벨 ID
  variant: SelectVariant; // 변경 가능한 버전 (default, disabled)
}

const SelectContext = createContext<SelectContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
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
  const [options, setOptions] = useState<SelectOption[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;

  const registerOption = useCallback(
    (optionValue: string, label: string, disabled?: boolean) => {
      setOptions((prev) => {
        const exists = prev.some((opt) => opt.value === optionValue);
        if (exists) {
          // 이미 존재하면 label과 disabled 상태 업데이트
          return prev.map((opt) =>
            opt.value === optionValue
              ? { ...opt, label, disabled: disabled ?? false }
              : opt
          );
        }
        return [
          ...prev,
          { value: optionValue, label, disabled: disabled ?? false },
        ];
      });
    },
    []
  );

  const isOptionDisabled = useCallback(
    (optionValue: string) => {
      const option = options.find((opt) => opt.value === optionValue);
      return option?.disabled ?? false;
    },
    [options]
  );

  const getSelectedLabel = useCallback(() => {
    if (!value) return undefined;
    const option = options.find((opt) => opt.value === value);
    return option?.label;
  }, [value, options]);

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
        isOptionDisabled,
        getSelectedLabel,
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
