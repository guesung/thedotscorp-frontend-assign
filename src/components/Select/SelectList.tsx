import { useEffect, useRef, type PropsWithChildren } from "react";
import { useSelectContext } from "./SelectRoot";

interface SelectListProps extends PropsWithChildren {
  maxHeight?: string;
}

export function SelectList({ children, maxHeight = "15rem" }: SelectListProps) {
  const { isOpen, listboxId, labelId, highlightedIndex } = useSelectContext();
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen || highlightedIndex === undefined) return;

    const optionId = `${listboxId}-option-${highlightedIndex}`;
    const optionElement = document.getElementById(optionId);

    if (optionElement) {
      optionElement.scrollIntoView({
        block: highlightedIndex === 0 ? "end" : "nearest",
      });
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
