import { type KeyboardEvent, type ReactNode } from 'react';
import { useSelectContext } from './SelectRoot';
import { cn } from '@/utils/cn';

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    options,
    triggerRef,
    listboxId,
    labelId,
    variant,
    selectedValue,
    selectedOption,
  } = useSelectContext();

  const isDisabled = variant === 'disabled';

  const handleOpen = () => {
    if (isDisabled) return;

    setIsOpen(true);
    const selectedIndex = options.findIndex(option => option.value === selectedValue);
    if (selectedIndex !== -1) {
      setHighlightedIndex(selectedIndex);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
    }
  };

  const activeOptionId =
    isOpen && options[highlightedIndex] && !options[highlightedIndex].disabled
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  const handleClick = () => {
    if (isDisabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      handleOpen();
    }
  };

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
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'w-full px-3 py-2 text-left rounded-md shadow-sm focus:outline-none',
        isDisabled
          ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
        className,
      )}
    >
      {selectedOption || children || '선택하세요'}
    </button>
  );
}
