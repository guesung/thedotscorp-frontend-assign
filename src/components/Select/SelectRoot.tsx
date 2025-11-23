import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
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

interface RegisterOptionProps {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectContextValue {
  isOpen: boolean; // DropDown 열림 여부
  setIsOpen: (open: boolean) => void;
  value?: string; // 선택된 값
  onChange?: (value: string) => void;
  highlightedIndex: number; // 하이라이트된 옵션 인덱스
  setHighlightedIndex: (index: number) => void;
  options: SelectOption[]; // 옵션 목록
  registerOption: (props: RegisterOptionProps) => void;
  isOptionDisabled: (value: string) => boolean; // 옵션이 비활성화되었는지 확인
  selectedLabel?: string; // 선택된 옵션의 라벨
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
    ({ value, label, disabled = false }: RegisterOptionProps) => {
      setOptions((prev) => {
        const exists = prev.some((option) => option.value === value);
        return exists ? prev : [...prev, { value: value, label, disabled }];
      });
    },
    []
  );

  const isOptionDisabled = useCallback(
    (value: string) => {
      const option = options.find((option) => option.value === value);
      return option?.disabled ?? false;
    },
    [options]
  );

  const selectedLabel = useMemo(() => {
    return options.find((option) => option.value === value)?.label;
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
        selectedLabel,
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
