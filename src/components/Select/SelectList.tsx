import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useSelectContext } from './SelectRoot';

interface SelectListProps extends PropsWithChildren {
  maxHeight?: string;
}

export function SelectList({ children, maxHeight = '15rem' }: SelectListProps) {
  const { isOpen, listboxId, labelId, highlightedIndex } = useSelectContext();
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
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
  }, [highlightedIndex, isOpen, listboxId]);

  if (!isOpen) return null;
  return (
    <ul
      ref={listboxRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={labelId}
      className="absolute z-dropdown w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-auto"
      style={{ maxHeight }}
    >
      {children}
    </ul>
  );
}
