import { createContext, useContext, useState, type ReactNode } from "react";

interface SelectContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  value?: string;
  onChange?: (value: string) => void;
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

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, value, onChange }}>
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
  const { isOpen, setIsOpen } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
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
  const { onChange, setIsOpen } = useSelectContext();

  const handleClick = () => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <li
      onClick={handleClick}
      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
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
