import { type PropsWithChildren } from 'react';
import { useSelectContext } from './SelectRoot';
import { cn } from '@/utils/cn';

export interface SelectOptionProps extends PropsWithChildren {
  value: string;
  disabled?: boolean;
  className?: string;
}

export function SelectOption({ children, value, disabled = false, className }: SelectOptionProps) {
  const { setSelectedValue, setIsOpen, highlightedIndex, options, triggerRef, listboxId, selectedValue } =
    useSelectContext();

  const index = options.findIndex(option => option.value === value);
  const isHighlighted = index === highlightedIndex;
  const isSelected = value === selectedValue;

  const handleSelectOptionClick = () => {
    if (disabled) return;

    setSelectedValue(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const getOptionClassName = () => {
    if (disabled) return 'text-gray-400 cursor-not-allowed';
    if (isHighlighted) return 'bg-primary-500 text-white cursor-pointer';
    return 'hover:bg-gray-100 cursor-pointer';
  };

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleSelectOptionClick}
      className={cn('px-3 py-2', getOptionClassName(), className)}
    >
      {children}
    </li>
  );
}
