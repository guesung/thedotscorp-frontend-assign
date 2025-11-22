import { useEffect, type PropsWithChildren } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectOptionProps extends PropsWithChildren {
  value: string;
}

export function SelectOption({ children, value }: SelectOptionProps) {
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
