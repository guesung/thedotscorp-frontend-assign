import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

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
}

function SelectRoot({ children, value, onChange }: SelectRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

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
  return (
    <label className="block mb-1 text-sm font-medium text-gray-700">
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
  } = useSelectContext();

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {children}
    </button>
  );
}

interface SelectPopupProps {
  children: ReactNode;
}

function SelectPopup({ children }: SelectPopupProps) {
  const { isOpen } = useSelectContext();

  if (!isOpen) return null;

  return (
    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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
  } = useSelectContext();

  const index = options.indexOf(value);
  const isHighlighted = index === highlightedIndex;

  useEffect(() => {
    registerOption(value);
    return () => unregisterOption(value);
  }, [value, registerOption, unregisterOption]);

  const handleClick = () => {
    onChange?.(value);
    setIsOpen(false);
  };

  console.log(isHighlighted);

  return (
    <li
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
