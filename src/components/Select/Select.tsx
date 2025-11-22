import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useId,
  type ReactNode,
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

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select 컴포넌트 내부에서 사용해야 합니다.");
  }
  return context;
}

interface SelectRootProps {
  children: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  variant?: SelectVariant;
}

function SelectRoot({
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

interface SelectLabelProps {
  children: ReactNode;
}

function SelectLabel({ children }: SelectLabelProps) {
  const { labelId, variant } = useSelectContext();

  return (
    <label
      id={labelId}
      className={`block mb-1 text-sm font-medium ${
        variant === "disabled" ? "text-gray-400" : "text-gray-700"
      }`}
    >
      {children}
    </label>
  );
}

interface SelectTriggerProps {
  children: ReactNode;
}

function SelectTrigger({ children }: SelectTriggerProps) {
  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    options,
    onChange,
    triggerRef,
    listboxId,
    labelId,
    variant,
  } = useSelectContext();

  const isDisabled = variant === "disabled";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(
            highlightedIndex < options.length - 1 ? highlightedIndex + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(
            highlightedIndex > 0 ? highlightedIndex - 1 : options.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && options[highlightedIndex]) {
          onChange?.(options[highlightedIndex]);
          setIsOpen(false);
          triggerRef.current?.focus();
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const activeOptionId =
    isOpen && options[highlightedIndex]
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-labelledby={labelId}
      aria-activedescendant={activeOptionId}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={() => !isDisabled && setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      className={`w-full px-3 py-2 text-left rounded-md shadow-sm focus:outline-none ${
        isDisabled
          ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }`}
    >
      {children}
    </button>
  );
}

interface SelectPopupProps {
  children: ReactNode;
}

function SelectPopup({ children }: SelectPopupProps) {
  const { isOpen, listboxId, labelId } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul
      id={listboxId}
      role="listbox"
      aria-labelledby={labelId}
      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      {children}
    </ul>
  );
}

interface SelectOptionProps {
  children: ReactNode;
  value: string;
}

function SelectOption({ children, value }: SelectOptionProps) {
  const {
    onChange,
    setIsOpen,
    highlightedIndex,
    options,
    registerOption,
    unregisterOption,
    triggerRef,
    listboxId,
    value: selectedValue,
  } = useSelectContext();

  const index = options.indexOf(value);
  const isHighlighted = index === highlightedIndex;
  const isSelected = value === selectedValue;

  useEffect(() => {
    registerOption(value);
    return () => unregisterOption(value);
  }, [value, registerOption, unregisterOption]);

  const handleClick = () => {
    onChange?.(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
      className={`px-3 py-2 cursor-pointer ${
        isHighlighted ? "bg-blue-500 text-white" : "hover:bg-gray-100"
      }`}
    >
      {children}
    </li>
  );
}

const Select = Object.assign(SelectRoot, {
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Popup: SelectPopup,
  Option: SelectOption,
});

export default Select;
