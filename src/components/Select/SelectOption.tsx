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
    registerOption(value, disabled);
    return () => unregisterOption(value);
  }, [value, disabled, registerOption, unregisterOption]);

  const handleClick = () => {
    if (disabled) return;
    onChange?.(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleClick}
      className={`px-3 py-2 ${
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : isHighlighted
          ? "bg-blue-500 text-white cursor-pointer"
          : "hover:bg-gray-100 cursor-pointer"
      }`}
    >
      {children}
    </li>
  );
}
