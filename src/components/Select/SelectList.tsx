import { useEffect, useRef, type KeyboardEvent, type PropsWithChildren } from 'react';
import { useSelectContext } from './SelectRoot';
import { cn } from '@/utils/cn';

interface SelectListProps extends PropsWithChildren {
  className?: string;
}

export function SelectList({ children, className = '' }: SelectListProps) {
  const {
    isOpen,
    listboxId,
    labelId,
    highlightedIndex,
    setHighlightedIndex,
    options,
    setSelectedValue,
    setIsOpen,
    triggerRef,
  } = useSelectContext();
  const listboxRef = useRef<HTMLUListElement>(null);

  const findNextEnabledIndex = (currentIndex: number, direction: 'up' | 'down') => {
    const optionCount = options.length;
    let nextIndex = currentIndex;

    for (let i = 0; i < optionCount; i++) {
      nextIndex = (nextIndex + (direction === 'down' ? 1 : -1) + optionCount) % optionCount;
      if (options[nextIndex] && !options[nextIndex].disabled) {
        return nextIndex;
      }
    }
    return currentIndex;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(findNextEnabledIndex(highlightedIndex, 'down'));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(findNextEnabledIndex(highlightedIndex, 'up'));
        break;
      case 'Enter':
        e.preventDefault();
        if (options[highlightedIndex] && !options[highlightedIndex].disabled) {
          setSelectedValue(options[highlightedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  useEffect(() => {
    (function focusListbox() {
      if (isOpen && listboxRef.current) {
        listboxRef.current.focus();
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    (function scrollToHighlightedOption() {
      if (!isOpen || highlightedIndex === undefined || !listboxRef.current) return;

      const optionId = `${listboxId}-option-${highlightedIndex}`;
      const optionElement = document.getElementById(optionId);

      if (optionElement && listboxRef.current) {
        const listbox = listboxRef.current;
        const optionTop = optionElement.offsetTop;
        const optionHeight = optionElement.offsetHeight;
        const listboxScrollTop = listbox.scrollTop;
        const listboxHeight = listbox.clientHeight;

        const optionBottom = optionTop + optionHeight;
        const visibleTop = listboxScrollTop;
        const visibleBottom = listboxScrollTop + listboxHeight;

        if (highlightedIndex === 0) {
          listbox.scrollTop = optionBottom - listboxHeight;
        } else if (optionTop < visibleTop) {
          listbox.scrollTop = optionTop;
        } else if (optionBottom > visibleBottom) {
          listbox.scrollTop = optionBottom - listboxHeight;
        }
      }
    })();
  }, [highlightedIndex, isOpen, listboxId]);

  if (!isOpen) return null;
  return (
    <ul
      ref={listboxRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'absolute z-dropdown w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto max-h-60',
        className,
      )}
    >
      {children}
    </ul>
  );
}
