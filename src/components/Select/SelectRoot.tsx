import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
} from "react";

type SelectVariant = "default" | "disabled";

interface SelectOption {
  value: string;
  children: ReactNode;
  disabled: boolean;
}

interface RegisterOptionProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

interface SelectContextValue {
  isOpen: boolean; // DropDown 열림 여부
  setIsOpen: (open: boolean) => void;
  selectedValue?: string; // 선택된 값
  setSelectedValue: (value: string | undefined) => void;
  highlightedIndex: number; // 하이라이트된 옵션 인덱스
  setHighlightedIndex: (index: number) => void;
  options: SelectOption[]; // 옵션 목록
  registerOption: (props: RegisterOptionProps) => void;
  selectedOption?: ReactNode; // 선택된 옵션의 children
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

export interface SelectHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
  blur: () => void;
  selectValue: (value: string) => void;
}

interface SelectRootProps extends PropsWithChildren {
  variant?: SelectVariant;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  width?: string;
}

export const SelectRoot = forwardRef<SelectHandle, SelectRootProps>(
  function SelectRoot(
    { children, variant = "default", value, onChange, width = "16rem" },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [options, setOptions] = useState<SelectOption[]>([]);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const id = useId();
    const listboxId = `${id}-listbox`;
    const labelId = `${id}-label`;

    const registerOption = useCallback(
      ({ value, children, disabled = false }: RegisterOptionProps) => {
        setOptions((prev) => {
          const exists = prev.some((option) => option.value === value);
          return exists
            ? prev
            : [...prev, { value: value, children, disabled }];
        });
      },
      []
    );

    const handleSetSelectedValue = useCallback(
      (newValue: string | undefined) => {
        onChange(newValue);
      },
      [onChange]
    );

    const selectedOption = useMemo(() => {
      return options.find((option) => option.value === value)?.children;
    }, [value, options]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          if (variant !== "disabled") {
            setIsOpen(true);
            const selectedIndex = options.findIndex(
              (option) => option.value === value
            );
            if (selectedIndex !== -1) {
              setHighlightedIndex(selectedIndex);
            }
          }
        },
        close: () => {
          setIsOpen(false);
          triggerRef.current?.focus();
        },
        toggle: () => {
          if (variant !== "disabled") {
            if (isOpen) {
              setIsOpen(false);
              triggerRef.current?.focus();
            } else {
              setIsOpen(true);
              const selectedIndex = options.findIndex(
                (option) => option.value === value
              );
              if (selectedIndex !== -1) {
                setHighlightedIndex(selectedIndex);
              }
            }
          }
        },
        focus: () => {
          triggerRef.current?.focus();
        },
        blur: () => {
          triggerRef.current?.blur();
        },
        selectValue: (newValue: string) => {
          if (variant !== "disabled") {
            const option = options.find((opt) => opt.value === newValue);
            if (option && !option.disabled) {
              handleSetSelectedValue(newValue);
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }
        },
      }),
      [variant, isOpen, options, value, handleSetSelectedValue]
    );

    const contextValue = useMemo(
      () => ({
        isOpen,
        setIsOpen,
        selectedValue: value,
        setSelectedValue: handleSetSelectedValue,
        highlightedIndex,
        setHighlightedIndex,
        options,
        registerOption,
        selectedOption,
        triggerRef,
        listboxId,
        labelId,
        variant,
      }),
      [
        isOpen,
        value,
        handleSetSelectedValue,
        highlightedIndex,
        options,
        registerOption,
        selectedOption,
        listboxId,
        labelId,
        variant,
      ]
    );

    return (
      <SelectContext.Provider value={contextValue}>
        <div className="relative" style={{ width }}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
