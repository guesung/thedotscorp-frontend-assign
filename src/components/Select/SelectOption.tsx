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

  return (
    <li
      id={`${listboxId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleSelectOptionClick}
      className={cn(
        'px-3 py-2',
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : isHighlighted
            ? 'bg-primary-500 text-white cursor-pointer'
            : 'hover:bg-gray-100 cursor-pointer',
        className,
      )}
    >
      {children}
    </li>
  );
}
