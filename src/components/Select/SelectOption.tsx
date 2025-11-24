import { useEffect, type PropsWithChildren } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectOptionProps extends PropsWithChildren {
  value: string;
  disabled?: boolean;
}

export function SelectOption({
  children,
  value,
  disabled = false,
}: SelectOptionProps) {
  const {
    setSelectedValue,
    setIsOpen,
    highlightedIndex,
    options,
    registerOption,
    triggerRef,
    listboxId,
    selectedValue,
  } = useSelectContext();

  const index = options.findIndex((option) => option.value === value);
  const isHighlighted = index === highlightedIndex;
  const isSelected = value === selectedValue;

  useEffect(() => {
    if (options.find((option) => option.value === value)) return;

    registerOption({ value, children, disabled });
  }, [value, children, disabled, registerOption, options]);

  const handleSelectOptionClick = () => {
    if (disabled) return;
    setSelectedValue(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleSelectOptionClick}
      className={`px-3 py-2 ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : isHighlighted
          ? "bg-primary-500 text-white cursor-pointer"
          : "hover:bg-gray-100 cursor-pointer"
      }`}
    >
      {children}
    </li>
  );
}
