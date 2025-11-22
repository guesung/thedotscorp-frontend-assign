import type { KeyboardEvent, ReactNode } from "react";
import { useSelectContext } from "./SelectRoot";
import { useEffect } from "storybook/internal/preview-api";

interface SelectTriggerProps {
  children: ReactNode;
}

export function SelectTrigger({ children }: SelectTriggerProps) {
  const {
    isOpen,
    setIsOpen,
    highlightedIndex,
    setHighlightedIndex,
    options,
    onChange,
    triggerRef,
    listboxId,
    labelId,
    variant,
    value,
  } = useSelectContext();

  const isDisabled = variant === "disabled";

  const handleOpen = () => {
    if (isDisabled) return;
    setIsOpen(true);
  };

  // 열렸을 때 선택된 옵션의 인덱스로 highlightedIndex 초기화
  useEffect(() => {
    if (isOpen && value && options.length > 0) {
      const selectedIndex = options.indexOf(value);
      if (selectedIndex !== -1) {
        setHighlightedIndex(selectedIndex);
      }
    }
  }, [isOpen, value, options, setHighlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setHighlightedIndex(
            highlightedIndex < options.length - 1 ? highlightedIndex + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(
            highlightedIndex > 0 ? highlightedIndex - 1 : options.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && options[highlightedIndex]) {
          onChange?.(options[highlightedIndex]);
          setIsOpen(false);
          triggerRef.current?.focus();
        } else {
          handleOpen();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const activeOptionId =
    isOpen && options[highlightedIndex]
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
      className={`w-full px-3 py-2 text-left rounded-md shadow-sm focus:outline-none ${
        isDisabled
          ? "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      }`}
    >
      {children}
    </button>
  );
}
